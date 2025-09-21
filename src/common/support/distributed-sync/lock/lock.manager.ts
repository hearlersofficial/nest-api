/**
 * 락 매니저 인터페이스
 * - 분산 환경에서의 동시성 제어
 * - TTL 기반 자동 만료 처리
 * - 패턴 기반 락 관리
 */
export abstract class LockManager {
  /**
   * 락 획득 시도
   * @param key 락 키
   * @param options 락 옵션 (TTL, 네임스페이스 등)
   * @returns 락 획득 성공 여부
   */
  abstract acquire(key: string, options?: LockOptions): Promise<boolean>;

  /**
   * 락 해제
   * @param key 락 키
   * @returns 해제 성공 여부 (락이 존재하지 않으면 false)
   */
  abstract release(key: string): Promise<boolean>;

  /**
   * 락 존재 여부 확인 (만료되지 않은 락만)
   * @param key 락 키
   * @returns 활성 락 존재 여부
   */
  abstract isLocked(key: string): Promise<boolean>;

  /**
   * 락 정보 조회
   * @param key 락 키
   * @returns 락 정보 또는 null (존재하지 않거나 만료된 경우)
   */
  abstract getLockInfo(key: string): Promise<LockInfo | null>;

  /**
   * 락 TTL 연장
   * @param key 락 키
   * @param extendBy 연장할 시간 (밀리초)
   * @returns 연장 성공 여부
   */
  abstract extend(key: string, extendBy: number): Promise<boolean>;

  /**
   * 패턴에 매칭되는 모든 락 해제
   * @param pattern 해제할 락 패턴 (예: "user:*", "session:123:*")
   * @returns 해제된 락 개수
   */
  abstract releasePattern(pattern: string): Promise<number>;

  /**
   * 락 획득 시도 with 재시도
   * @param key 락 키
   * @param options 락 옵션
   * @param retryOptions 재시도 옵션
   * @returns 락 획득 성공 여부
   */
  abstract acquireWithRetry(key: string, options?: LockOptions, retryOptions?: RetryOptions): Promise<boolean>;

  /**
   * 만료된 락들 정리 (백그라운드 작업)
   * @returns 정리된 락 개수
   */
  abstract cleanup(): Promise<number>;

  /**
   * 모든 락 해제
   * @param pattern 해제할 패턴 (기본값: "*" - 모든 락)
   * @returns 해제된 락 개수
   */
  abstract clear(pattern?: string): Promise<number>;
}

/**
 * 락 설정 옵션
 */
export interface LockOptions {
  /**
   * TTL(Time To Live) - 락 만료 시간 (밀리초)
   * @default 300000 (5분)
   */
  ttl?: number;

  /**
   * 네임스페이스 - 키 앞에 자동으로 붙는 접두사
   * @example "counsel" -> "counsel:actual_key"
   */
  namespace?: string;

  /**
   * 락 소유자 식별자 (선택적)
   * @description 락을 소유한 프로세스나 스레드 식별용
   */
  owner?: string;
}

/**
 * 재시도 옵션
 */
export interface RetryOptions {
  /**
   * 최대 재시도 횟수
   * @default 3
   */
  maxRetries?: number;

  /**
   * 재시도 간격 (밀리초)
   * @default 100
   */
  retryDelay?: number;

  /**
   * 백오프 전략
   * @default "fixed"
   */
  backoffStrategy?: "fixed" | "exponential" | "linear";
}

/**
 * 락 정보
 */
export interface LockInfo {
  /**
   * 락 키
   */
  key: string;

  /**
   * 락 획득 시간
   */
  acquiredAt: Date;

  /**
   * 락 만료 시간
   */
  expiresAt: Date;

  /**
   * TTL (밀리초)
   */
  ttl: number;

  /**
   * 락 소유자 (있는 경우)
   */
  owner?: string;

  /**
   * 만료 여부
   */
  isExpired: boolean;

  /**
   * 남은 시간 (밀리초)
   */
  remainingTime: number;
}
