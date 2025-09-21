import { CacheManager, CacheOptions } from "../cache.manager";
import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";

/**
 * 인메모리 캐시 매니저 구현체
 * - Map 기반의 인메모리 저장소 사용
 * - TTL 기반 만료 처리
 * - 패턴 매칭을 통한 키 삭제 지원
 */
@Injectable()
export class InMemoryCacheManager extends CacheManager implements OnModuleDestroy {
  private readonly logger = new Logger(InMemoryCacheManager.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly defaultTtl = 60000; // 1분
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    super();
    // 주기적으로 만료된 키들 정리 (30초마다)
    this.startCleanupTimer();
  }

  /**
   * 키-값 저장
   */
  async set(key: string, value: any, options?: CacheOptions): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key, options?.namespace);
      const ttl = options?.ttl ?? this.defaultTtl;
      const expiresAt = Date.now() + ttl;

      const entry: CacheEntry = {
        value: JSON.stringify(value),
        expiresAt,
        createdAt: Date.now(),
      };

      this.cache.set(fullKey, entry);
      return true;
    } catch (error) {
      this.logger.error(`캐시 저장 실패: ${key}`, error);
      return false;
    }
  }

  /**
   * 값 조회
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key);
      const entry = this.cache.get(fullKey);

      if (!entry) {
        return null;
      }

      // TTL 만료 체크
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(fullKey);
        return null;
      }

      return JSON.parse(entry.value) as T;
    } catch (error) {
      this.logger.error(`캐시 조회 실패: ${key}`, error);
      return null;
    }
  }

  /**
   * 키 존재 여부 확인
   */
  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  /**
   * 키 삭제
   */
  async delete(key: string): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      return this.cache.delete(fullKey);
    } catch (error) {
      this.logger.error(`캐시 삭제 실패: ${key}`, error);
      return false;
    }
  }

  /**
   * 패턴에 매칭되는 모든 키 삭제
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const regex = this.createPatternRegex(pattern);
      const keysToDelete: string[] = [];

      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          keysToDelete.push(key);
        }
      }

      for (const key of keysToDelete) {
        this.cache.delete(key);
      }

      return keysToDelete.length;
    } catch (error) {
      this.logger.error(`패턴 삭제 실패: ${pattern}`, error);
      return 0;
    }
  }

  /**
   * 키가 존재하지 않을 때만 설정 (원자적 연산)
   */
  async setIfNotExists(key: string, value: any, options?: CacheOptions): Promise<boolean> {
    const exists = await this.exists(key);
    if (exists) {
      return false;
    }
    return this.set(key, value, options);
  }

  /**
   * 만료된 키들 정리
   */
  async cleanup(): Promise<number> {
    try {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          keysToDelete.push(key);
        }
      }

      for (const key of keysToDelete) {
        this.cache.delete(key);
      }

      if (keysToDelete.length > 0) {
        this.logger.debug(`만료된 캐시 ${keysToDelete.length}개 정리 완료`);
      }

      return keysToDelete.length;
    } catch (error) {
      this.logger.error("캐시 정리 실패", error);
      return 0;
    }
  }

  /**
   * 모든 캐시 데이터 삭제
   */
  async clear(pattern = "*"): Promise<number> {
    try {
      if (pattern === "*") {
        const count = this.cache.size;
        this.cache.clear();
        return count;
      }

      return this.deletePattern(pattern);
    } catch (error) {
      this.logger.error(`캐시 클리어 실패: ${pattern}`, error);
      return 0;
    }
  }

  /**
   * 네임스페이스를 포함한 전체 키 생성
   */
  private buildKey(key: string, namespace?: string): string {
    return namespace ? `${namespace}:${key}` : key;
  }

  /**
   * 패턴을 정규식으로 변환
   * @param pattern 패턴 문자열 (예: "user:*", "session:123:*")
   */
  private createPatternRegex(pattern: string): RegExp {
    const escapedPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // 특수 문자 이스케이프
      .replace(/\\\*/g, ".*"); // * -> .*로 변환

    return new RegExp(`^${escapedPattern}$`);
  }

  /**
   * 정리 타이머 시작
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(async () => {
      await this.cleanup();
    }, 30000); // 30초마다 정리
  }

  /**
   * 리소스 정리 (애플리케이션 종료 시 호출)
   */
  onModuleDestroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.cache.clear();
    this.logger.debug("InMemoryCacheManager destroyed");
  }
}

/**
 * 캐시 엔트리 인터페이스
 */
interface CacheEntry {
  value: string; // JSON 직렬화된 값
  expiresAt: number; // 만료 시간 (타임스탬프)
  createdAt: number; // 생성 시간 (타임스탬프)
}
