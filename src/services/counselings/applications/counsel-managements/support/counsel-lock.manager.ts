import { Injectable, Logger } from "@nestjs/common";

/**
 * Counsel별 동시성 제어를 위한 락 매니저
 * 특정 counsel에 대해 컨텍스트 수정 작업(압축, 분석, 전환)이 동시에 실행되지 않도록 보장
 */
@Injectable()
export class CounselLockManager {
  private readonly locks = new Map<string, { acquired: Date; ttl: number }>();
  private readonly logger = new Logger(CounselLockManager.name);

  // 기본 TTL: 60초 (긴 분석 작업도 고려)
  private static readonly DEFAULT_TTL = 60000;

  /**
   * 특정 counsel에 대한 락 획득 시도
   * @param counselId counsel ID (string)
   * @param ttl 락 유지 시간 (밀리초, 기본값: 60초)
   * @returns 락 획득 성공 여부
   */
  tryAcquire(counselId: string, ttl: number = CounselLockManager.DEFAULT_TTL): boolean {
    try {
      const existing = this.locks.get(counselId);
      const now = Date.now();

      // 기존 락이 있고 아직 유효한 경우
      if (existing && now - existing.acquired.getTime() < existing.ttl) {
        this.logger.debug(`Lock already held for counsel: ${counselId}`);
        return false;
      }

      // 만료된 락이 있다면 정리
      if (existing) {
        this.logger.warn(`Cleaning up expired lock for counsel: ${counselId}`);
        this.locks.delete(counselId);
      }

      // 새로운 락 설정
      this.locks.set(counselId, {
        acquired: new Date(),
        ttl,
      });

      this.logger.debug(`Lock acquired for counsel: ${counselId}, TTL: ${ttl}ms`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to acquire lock for counsel: ${counselId}`, error);
      return false;
    }
  }

  /**
   * 특정 counsel에 대한 락 해제
   * @param counselId counsel ID (string)
   */
  release(counselId: string): void {
    try {
      const removed = this.locks.delete(counselId);
      if (removed) {
        this.logger.debug(`Lock released for counsel: ${counselId}`);
      } else {
        this.logger.warn(`Attempted to release non-existent lock for counsel: ${counselId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to release lock for counsel: ${counselId}`, error);
    }
  }

  /**
   * 현재 락 상태 조회 (디버깅/모니터링 용도)
   * @param counselId counsel ID (string)
   * @returns 락 정보 또는 null
   */
  getLockInfo(counselId: string): { acquired: Date; ttl: number; isExpired: boolean } | null {
    const lockInfo = this.locks.get(counselId);
    if (!lockInfo) return null;

    const now = Date.now();
    const isExpired = now - lockInfo.acquired.getTime() >= lockInfo.ttl;

    return {
      acquired: lockInfo.acquired,
      ttl: lockInfo.ttl,
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

    for (const [counselId, lockInfo] of this.locks.entries()) {
      if (now - lockInfo.acquired.getTime() >= lockInfo.ttl) {
        this.locks.delete(counselId);
        cleanedCount++;
        this.logger.debug(`Cleaned up expired lock for counsel: ${counselId}`);
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} expired locks`);
    }

    return cleanedCount;
  }

  /**
   * 현재 활성 락 통계
   * @returns 락 통계 정보
   */
  getStats(): {
    totalLocks: number;
    expiredLocks: number;
    activeLocks: number;
  } {
    const now = Date.now();
    let expiredCount = 0;

    for (const lockInfo of this.locks.values()) {
      if (now - lockInfo.acquired.getTime() >= lockInfo.ttl) {
        expiredCount++;
      }
    }

    return {
      totalLocks: this.locks.size,
      expiredLocks: expiredCount,
      activeLocks: this.locks.size - expiredCount,
    };
  }

  /**
   * 특정 counsel의 락이 현재 활성 상태인지 확인
   * @param counselId counsel ID (string)
   * @returns 활성 락 보유 여부
   */
  hasActiveLock(counselId: string): boolean {
    const lockInfo = this.locks.get(counselId);
    if (!lockInfo) return false;

    const now = Date.now();
    return now - lockInfo.acquired.getTime() < lockInfo.ttl;
  }
}
