import { Injectable, Logger } from "@nestjs/common";
import { LockManager } from "~common/support/distributed-sync/lock/lock.manager";

/**
 * 작업 유형 정의
 */
export enum LockType {
  COMPRESSION = "compression",
  ANALYSIS_TRANSITION = "analysis-transition",
  MAIN_FLOW = "main-flow", // 메인 상담 진행 플로우
  GENERAL = "general", // 기본 락 타입
}

/**
 * Counsel별 작업별 동시성 제어를 위한 락 매니저
 * 특정 counsel에 대해 압축, 분석, 전환 작업을 독립적으로 관리
 * 공용 LockManager를 활용하여 분산 환경 지원
 */
@Injectable()
export class CounselLockManager {
  private readonly logger = new Logger(CounselLockManager.name);
  private readonly namespace = "counsel"; // 네임스페이스로 counsel 락 구분

  // 기본 TTL: 5분 (긴 분석 작업도 고려)
  private static readonly DEFAULT_TTL = 300000;

  constructor(private readonly lockManager: LockManager) {}

  /**
   * 락 키 생성 (counselId + lockType 조합)
   */
  private generateLockKey(counselId: string, lockType: LockType): string {
    return `${counselId}:${lockType}`;
  }

  /**
   * 특정 counsel에 대한 특정 작업의 락 획득 시도
   * @param counselId counsel ID (string)
   * @param lockType 락 유형 (압축, 분석, 전이 등)
   * @param ttl 락 유지 시간 (밀리초, 기본값: 5분)
   * @returns 락 획득 성공 여부
   */
  async tryAcquire(
    counselId: string,
    lockType: LockType = LockType.GENERAL,
    ttl: number = CounselLockManager.DEFAULT_TTL,
  ): Promise<boolean> {
    try {
      const lockKey = this.generateLockKey(counselId, lockType);

      const acquired = await this.lockManager.acquire(lockKey, {
        ttl,
        namespace: this.namespace,
        owner: this.generateOwner(),
      });

      if (acquired) {
        this.logger.debug(`Lock acquired for counsel: ${counselId}, type: ${lockType}, TTL: ${ttl}ms`);
      } else {
        this.logger.debug(`Lock already held for counsel: ${counselId}, type: ${lockType}`);
      }

      return acquired;
    } catch (error) {
      this.logger.error(`Failed to acquire lock for counsel: ${counselId}, type: ${lockType}`, error);
      return false;
    }
  }

  /**
   * 특정 counsel에 대한 특정 작업의 락 해제
   * @param counselId counsel ID (string)
   * @param lockType 락 유형 (압축, 분석, 전이 등)
   */
  async release(counselId: string, lockType: LockType = LockType.GENERAL): Promise<void> {
    try {
      const lockKey = this.generateLockKey(counselId, lockType);
      const fullKey = `${this.namespace}:${lockKey}`;

      const released = await this.lockManager.release(fullKey);

      if (released) {
        this.logger.debug(`Lock released for counsel: ${counselId}, type: ${lockType}`);
      } else {
        this.logger.warn(`Attempted to release non-existent lock for counsel: ${counselId}, type: ${lockType}`);
      }
    } catch (error) {
      this.logger.error(`Failed to release lock for counsel: ${counselId}, type: ${lockType}`, error);
    }
  }

  /**
   * 현재 락 상태 조회 (디버깅/모니터링 용도)
   * @param counselId counsel ID (string)
   * @param lockType 락 유형 (압축, 분석, 전이 등)
   * @returns 락 정보 또는 null
   */
  async getLockInfo(
    counselId: string,
    lockType: LockType = LockType.GENERAL,
  ): Promise<{ acquired: Date; ttl: number; type: LockType; isExpired: boolean } | null> {
    try {
      const lockKey = this.generateLockKey(counselId, lockType);
      const fullKey = `${this.namespace}:${lockKey}`;

      const lockInfo = await this.lockManager.getLockInfo(fullKey);

      if (!lockInfo) {
        return null;
      }

      return {
        acquired: lockInfo.acquiredAt,
        ttl: lockInfo.ttl,
        type: lockType,
        isExpired: lockInfo.isExpired,
      };
    } catch (error) {
      this.logger.error(`Failed to get lock info for counsel: ${counselId}, type: ${lockType}`, error);
      return null;
    }
  }

  /**
   * 특정 counsel의 특정 작업 락이 현재 활성 상태인지 확인
   * @param counselId counsel ID (string)
   * @param lockType 락 유형 (압축, 분석, 전이 등)
   * @returns 활성 락 보유 여부
   */
  async hasActiveLock(counselId: string, lockType: LockType = LockType.GENERAL): Promise<boolean> {
    try {
      const lockKey = this.generateLockKey(counselId, lockType);
      const fullKey = `${this.namespace}:${lockKey}`;

      return await this.lockManager.isLocked(fullKey);
    } catch (error) {
      this.logger.error(`Failed to check active lock for counsel: ${counselId}, type: ${lockType}`, error);
      return false;
    }
  }

  /**
   * 특정 counsel의 모든 락 정보 조회
   * @param counselId counsel ID (string)
   * @returns 해당 counsel의 모든 락 정보
   */
  async getAllLocksForCounsel(counselId: string): Promise<
    Array<{
      type: LockType;
      acquired: Date;
      ttl: number;
      isExpired: boolean;
    }>
  > {
    try {
      const result: Array<{
        type: LockType;
        acquired: Date;
        ttl: number;
        isExpired: boolean;
      }> = [];

      // 모든 락 타입에 대해 개별 조회
      for (const lockType of Object.values(LockType)) {
        const lockInfo = await this.getLockInfo(counselId, lockType);
        if (lockInfo) {
          result.push({
            type: lockType,
            acquired: lockInfo.acquired,
            ttl: lockInfo.ttl,
            isExpired: lockInfo.isExpired,
          });
        }
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to get all locks for counsel: ${counselId}`, error);
      return [];
    }
  }

  /**
   * 특정 counsel의 모든 락 해제
   * @param counselId counsel ID (string)
   * @returns 해제된 락 개수
   */
  async releaseAllForCounsel(counselId: string): Promise<number> {
    try {
      // counsel의 모든 락 타입에 대해 패턴 매칭으로 해제
      const pattern = `${this.namespace}:${counselId}:*`;
      const releasedCount = await this.lockManager.releasePattern(pattern);

      if (releasedCount > 0) {
        this.logger.log(`Released ${releasedCount} locks for counsel: ${counselId}`);
      }

      return releasedCount;
    } catch (error) {
      this.logger.error(`Failed to release all locks for counsel: ${counselId}`, error);
      return 0;
    }
  }

  /**
   * 소유자 ID 생성
   */
  private generateOwner(): string {
    return `counsel-lock-${process.pid}-${Date.now()}`;
  }
}
