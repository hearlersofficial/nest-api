/**
 * 캐시 매니저 인터페이스
 * - 기본적인 CRUD 작업과 패턴 기반 삭제 지원
 * - TTL 기반 만료 처리
 */
export abstract class CacheManager {
  /**
   * 키-값 저장
   * @param key 캐시 키
   * @param value 저장할 값 (JSON 직렬화 가능한 모든 타입)
   * @param options 캐시 옵션 (TTL, 네임스페이스 등)
   * @returns 저장 성공 여부
   */
  abstract set(key: string, value: any, options?: CacheOptions): Promise<boolean>;

  /**
   * 값 조회
   * @param key 캐시 키
   * @returns 저장된 값 또는 null (만료되었거나 존재하지 않는 경우)
   */
  abstract get<T = any>(key: string): Promise<T | null>;

  /**
   * 키 존재 여부 확인
   * @param key 캐시 키
   * @returns 키 존재 여부 (만료된 키는 false)
   */
  abstract exists(key: string): Promise<boolean>;

  /**
   * 키 삭제
   * @param key 캐시 키
   * @returns 삭제 성공 여부
   */
  abstract delete(key: string): Promise<boolean>;

  /**
   * 패턴에 매칭되는 모든 키 삭제
   * @param pattern 삭제할 키 패턴 (예: "user:*", "session:123:*")
   * @returns 삭제된 키 개수
   */
  abstract deletePattern(pattern: string): Promise<number>;

  /**
   * 키가 존재하지 않을 때만 설정 (원자적 연산)
   * @param key 캐시 키
   * @param value 저장할 값
   * @param options 캐시 옵션 (TTL, 네임스페이스 등)
   * @returns 설정 성공 여부 (이미 존재하면 false)
   */
  abstract setIfNotExists(key: string, value: any, options?: CacheOptions): Promise<boolean>;

  /**
   * 만료된 키들 정리 (백그라운드 작업)
   * @returns 정리된 키 개수
   */
  abstract cleanup(): Promise<number>;

  /**
   * 모든 캐시 데이터 삭제
   * @param pattern 삭제할 패턴 (기본값: "*" - 모든 키)
   * @returns 삭제된 키 개수
   */
  abstract clear(pattern?: string): Promise<number>;
}

/**
 * 캐시 설정 옵션
 */
export interface CacheOptions {
  /**
   * TTL(Time To Live) - 캐시 만료 시간 (밀리초)
   * @default 60000 (1분)
   */
  ttl?: number;

  /**
   * 네임스페이스 - 키 앞에 자동으로 붙는 접두사
   * @example "user" -> "user:actual_key"
   */
  namespace?: string;
}
