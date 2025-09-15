import { Injectable, Logger } from "@nestjs/common";

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
 */
@Injectable()
export class CounselLockManager {
  private readonly locks = new Map<string, { acquired: Date; ttl: number; type: LockType }>();
  private readonly logger = new Logger(CounselLockManager.name);

  // 기본 TTL: 5분 (긴 분석 작업도 고려)
  private static readonly DEFAULT_TTL = 300000;

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
   * @param ttl 락 유지 시간 (밀리초, 기본값: 60초)
   * @returns 락 획득 성공 여부
   */
  tryAcquire(
    counselId: string,
    lockType: LockType = LockType.GENERAL,
    ttl: number = CounselLockManager.DEFAULT_TTL,
  ): boolean {
    try {
      const lockKey = this.generateLockKey(counselId, lockType);
      const existing = this.locks.get(lockKey);
      const now = Date.now();

      // 기존 락이 있고 아직 유효한 경우
      if (existing && now - existing.acquired.getTime() < existing.ttl) {
        this.logger.debug(`Lock already held for counsel: ${counselId}, type: ${lockType}`);
        return false;
      }

      // 만료된 락이 있다면 정리
      if (existing) {
        this.logger.warn(`Cleaning up expired lock for counsel: ${counselId}, type: ${lockType}`);
        this.locks.delete(lockKey);
      }

      // 새로운 락 설정
      this.locks.set(lockKey, {
        acquired: new Date(),
        ttl,
        type: lockType,
      });

      this.logger.debug(`Lock acquired for counsel: ${counselId}, type: ${lockType}, TTL: ${ttl}ms`);
      return true;
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
  release(counselId: string, lockType: LockType = LockType.GENERAL): void {
    try {
      const lockKey = this.generateLockKey(counselId, lockType);
      const removed = this.locks.delete(lockKey);
      if (removed) {
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
  getLockInfo(
    counselId: string,
    lockType: LockType = LockType.GENERAL,
  ): { acquired: Date; ttl: number; type: LockType; isExpired: boolean } | null {
    const lockKey = this.generateLockKey(counselId, lockType);
    const lockInfo = this.locks.get(lockKey);
    if (!lockInfo) return null;

    const now = Date.now();
    const isExpired = now - lockInfo.acquired.getTime() >= lockInfo.ttl;

    return {
      acquired: lockInfo.acquired,
      ttl: lockInfo.ttl,
      type: lockInfo.type,
      isExpired,
    };
  }

  /**
   * 모든 만료된 락 정리 (주기적 정리용)
   * @returns 정리된 락 개수
   */
  cleanupExpiredLocks(): number {
    let cleanedCount = 0;
    const now = Date.now();

    for (const [lockKey, lockInfo] of this.locks.entries()) {
      if (now - lockInfo.acquired.getTime() >= lockInfo.ttl) {
        this.locks.delete(lockKey);
        cleanedCount++;
        this.logger.debug(`Cleaned up expired lock: ${lockKey}`);
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} expired locks`);
    }

    return cleanedCount;
  }

  /**
   * 특정 counsel의 특정 작업 락이 현재 활성 상태인지 확인
   * @param counselId counsel ID (string)
   * @param lockType 락 유형 (압축, 분석, 전이 등)
   * @returns 활성 락 보유 여부
   */
  hasActiveLock(counselId: string, lockType: LockType = LockType.GENERAL): boolean {
    const lockKey = this.generateLockKey(counselId, lockType);
    const lockInfo = this.locks.get(lockKey);
    if (!lockInfo) return false;

    const now = Date.now();
    return now - lockInfo.acquired.getTime() < lockInfo.ttl;
  }

  /**
   * 특정 counsel의 모든 락 정보 조회
   * @param counselId counsel ID (string)
   * @returns 해당 counsel의 모든 락 정보
   */
  getAllLocksForCounsel(counselId: string): Array<{
    type: LockType;
    acquired: Date;
    ttl: number;
    isExpired: boolean;
  }> {
    const result: Array<{
      type: LockType;
      acquired: Date;
      ttl: number;
      isExpired: boolean;
    }> = [];
    const now = Date.now();

    for (const [lockKey, lockInfo] of this.locks.entries()) {
      if (lockKey.startsWith(`${counselId}:`)) {
        const isExpired = now - lockInfo.acquired.getTime() >= lockInfo.ttl;
        result.push({
          type: lockInfo.type,
          acquired: lockInfo.acquired,
          ttl: lockInfo.ttl,
          isExpired,
        });
      }
    }

    return result;
  }

  /**
   * 특정 counsel의 모든 락 해제
   * @param counselId counsel ID (string)
   * @returns 해제된 락 개수
   */
  releaseAllForCounsel(counselId: string): number {
    let releasedCount = 0;

    for (const lockKey of this.locks.keys()) {
      if (lockKey.startsWith(`${counselId}:`)) {
        this.locks.delete(lockKey);
        releasedCount++;
        this.logger.debug(`Released lock: ${lockKey}`);
      }
    }

    if (releasedCount > 0) {
      this.logger.log(`Released ${releasedCount} locks for counsel: ${counselId}`);
    }

    return releasedCount;
  }
}
