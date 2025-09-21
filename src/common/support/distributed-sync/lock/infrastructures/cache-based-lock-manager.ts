import { CacheManager } from "../../cache/cache.manager";
import { LockInfo, LockManager, LockOptions, RetryOptions } from "../lock.manager";
import { Injectable, Logger } from "@nestjs/common";

/**
 * 캐시 기반 락 매니저 구현체
 * - CacheManager를 활용한 분산 락 구현
 * - Redis 등으로 확장 가능한 구조
 * - 원자적 연산 지원
 */
@Injectable()
export class CacheBasedLockManager extends LockManager {
  private readonly logger = new Logger(CacheBasedLockManager.name);
  private readonly defaultTtl = 300000; // 5분
  private readonly lockPrefix = "lock:";

  constructor(private readonly cacheManager: CacheManager) {
    super();
  }

  /**
   * 락 획득 시도
   */
  async acquire(key: string, options?: LockOptions): Promise<boolean> {
    try {
      const lockKey = this.buildLockKey(key, options?.namespace);
      const ttl = options?.ttl ?? this.defaultTtl;
      const owner = options?.owner ?? this.generateOwner();

      const lockData: CacheLockData = {
        key,
        acquiredAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + ttl).toISOString(),
        ttl,
        owner,
      };

      // setIfNotExists를 사용하여 원자적으로 락 획득
      const acquired = await this.cacheManager.setIfNotExists(lockKey, lockData, { ttl });

      if (acquired) {
        this.logger.debug(`Lock acquired: ${lockKey}, owner: ${owner}`);
      } else {
        this.logger.debug(`Lock acquisition failed: ${lockKey}`);
      }

      return acquired;
    } catch (error) {
      this.logger.error(`Failed to acquire lock: ${key}`, error);
      return false;
    }
  }

  /**
   * 락 해제
   */
  async release(key: string): Promise<boolean> {
    try {
      const lockKey = this.buildLockKey(key);
      const released = await this.cacheManager.delete(lockKey);

      if (released) {
        this.logger.debug(`Lock released: ${lockKey}`);
      } else {
        this.logger.debug(`Lock release failed (not found): ${lockKey}`);
      }

      return released;
    } catch (error) {
      this.logger.error(`Failed to release lock: ${key}`, error);
      return false;
    }
  }

  /**
   * 락 존재 여부 확인
   */
  async isLocked(key: string): Promise<boolean> {
    try {
      const lockKey = this.buildLockKey(key);
      return await this.cacheManager.exists(lockKey);
    } catch (error) {
      this.logger.error(`Failed to check lock existence: ${key}`, error);
      return false;
    }
  }

  /**
   * 락 정보 조회
   */
  async getLockInfo(key: string): Promise<LockInfo | null> {
    try {
      const lockKey = this.buildLockKey(key);
      const lockData = await this.cacheManager.get<CacheLockData>(lockKey);

      if (!lockData) {
        return null;
      }

      const now = Date.now();
      const acquiredAt = new Date(lockData.acquiredAt);
      const expiresAt = new Date(lockData.expiresAt);
      const isExpired = now >= expiresAt.getTime();
      const remainingTime = Math.max(0, expiresAt.getTime() - now);

      return {
        key: lockData.key,
        acquiredAt,
        expiresAt,
        ttl: lockData.ttl,
        owner: lockData.owner,
        isExpired,
        remainingTime,
      };
    } catch (error) {
      this.logger.error(`Failed to get lock info: ${key}`, error);
      return null;
    }
  }

  /**
   * 락 TTL 연장
   */
  async extend(key: string, extendBy: number): Promise<boolean> {
    try {
      const lockInfo = await this.getLockInfo(key);
      if (!lockInfo || lockInfo.isExpired) {
        return false;
      }

      const lockKey = this.buildLockKey(key);
      const newTtl = lockInfo.ttl + extendBy;
      const newExpiresAt = new Date(Date.now() + newTtl);

      const updatedLockData: CacheLockData = {
        key: lockInfo.key,
        acquiredAt: lockInfo.acquiredAt.toISOString(),
        expiresAt: newExpiresAt.toISOString(),
        ttl: newTtl,
        owner: lockInfo.owner,
      };

      const extended = await this.cacheManager.set(lockKey, updatedLockData, { ttl: newTtl });

      if (extended) {
        this.logger.debug(`Lock extended: ${lockKey}, new TTL: ${newTtl}ms`);
      }

      return extended;
    } catch (error) {
      this.logger.error(`Failed to extend lock: ${key}`, error);
      return false;
    }
  }

  /**
   * 패턴에 매칭되는 모든 락 해제
   */
  async releasePattern(pattern: string): Promise<number> {
    try {
      const lockPattern = this.buildLockKey(pattern);
      const releasedCount = await this.cacheManager.deletePattern(lockPattern);

      if (releasedCount > 0) {
        this.logger.debug(`Released ${releasedCount} locks matching pattern: ${pattern}`);
      }

      return releasedCount;
    } catch (error) {
      this.logger.error(`Failed to release locks by pattern: ${pattern}`, error);
      return 0;
    }
  }

  /**
   * 락 획득 시도 with 재시도
   */
  async acquireWithRetry(key: string, options?: LockOptions, retryOptions?: RetryOptions): Promise<boolean> {
    const maxRetries = retryOptions?.maxRetries ?? 3;
    const baseDelay = retryOptions?.retryDelay ?? 100;
    const backoffStrategy = retryOptions?.backoffStrategy ?? "fixed";

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const acquired = await this.acquire(key, options);
      if (acquired) {
        if (attempt > 0) {
          this.logger.debug(`Lock acquired after ${attempt} retries: ${key}`);
        }
        return true;
      }

      // 마지막 시도가 아니면 대기
      if (attempt < maxRetries) {
        const delay = this.calculateDelay(baseDelay, attempt, backoffStrategy);
        await this.sleep(delay);
      }
    }

    this.logger.debug(`Failed to acquire lock after ${maxRetries} retries: ${key}`);
    return false;
  }

  /**
   * 만료된 락들 정리
   */
  async cleanup(): Promise<number> {
    try {
      // 캐시 매니저의 cleanup을 활용
      return await this.cacheManager.cleanup();
    } catch (error) {
      this.logger.error("Failed to cleanup expired locks", error);
      return 0;
    }
  }

  /**
   * 모든 락 해제
   */
  async clear(pattern = "*"): Promise<number> {
    try {
      const lockPattern = this.buildLockKey(pattern);
      return await this.cacheManager.clear(lockPattern);
    } catch (error) {
      this.logger.error(`Failed to clear locks: ${pattern}`, error);
      return 0;
    }
  }

  /**
   * 락 키 생성 (네임스페이스 포함)
   */
  private buildLockKey(key: string, namespace?: string): string {
    const baseKey = namespace ? `${namespace}:${key}` : key;
    return `${this.lockPrefix}${baseKey}`;
  }

  /**
   * 소유자 ID 생성
   */
  private generateOwner(): string {
    return `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * 재시도 지연 시간 계산
   */
  private calculateDelay(baseDelay: number, attempt: number, strategy: string): number {
    switch (strategy) {
      case "exponential":
        return baseDelay * Math.pow(2, attempt);
      case "linear":
        return baseDelay * (attempt + 1);
      case "fixed":
      default:
        return baseDelay;
    }
  }

  /**
   * 지연 함수
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * 캐시에 저장되는 락 데이터 구조
 */
interface CacheLockData {
  key: string;
  acquiredAt: string; // ISO string
  expiresAt: string; // ISO string
  ttl: number;
  owner?: string;
}
