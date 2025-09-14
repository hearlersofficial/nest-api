import { Logger } from "@nestjs/common";

/**
 * Fire-and-forget 실행을 위한 유틸리티 클래스
 * 동기/비동기 함수를 백그라운드에서 실행하면서 에러를 적절히 처리합니다.
 */
export class FireAndForget {
  private static readonly logger = new Logger(FireAndForget.name);

  /**
   * 함수를 fire-and-forget 방식으로 실행합니다.
   * @param fn 실행할 함수
   * @param context 로깅을 위한 컨텍스트 정보 (optional)
   * @param onError 에러 발생시 추가 처리 함수 (optional)
   * @param silent 에러 발생시 로깅을 생략할지 여부 (default: false)
   */
  static execute<T>(
    fn: (() => T) | (() => Promise<T>),
    options?: {
      context?: string;
      onError?: (error: Error) => void;
      silent?: boolean;
    },
  ): void {
    const { context = "Unknown", onError, silent = false } = options || {};

    Promise.resolve()
      .then(() => fn())
      .then(() => {
        if (!silent) this.logger.debug(`Fire-and-forget succeeded: ${context}`);
      })
      .catch((error) => {
        if (!silent) this.logger.error(`Fire-and-forget failed: ${context}`, error);
        if (onError) onError(error);
      });
  }
}
