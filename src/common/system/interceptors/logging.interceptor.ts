import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  private safeStringify(obj: any): string {
    return JSON.stringify(
      obj,
      (key, value) => {
        // BigInt 처리
        if (typeof value === "bigint") {
          return value.toString();
        }

        // Date 객체 처리
        if (value instanceof Date) {
          return value.toISOString();
        }

        // Buffer 처리
        if (Buffer.isBuffer(value)) {
          return value.toString("base64");
        }

        // Set, Map 처리
        if (value instanceof Set) {
          return Array.from(value);
        }
        if (value instanceof Map) {
          return Object.fromEntries(value);
        }

        // Error 객체 처리
        if (value instanceof Error) {
          return {
            name: value.name,
            message: value.message,
            stack: value.stack,
          };
        }

        // undefined 처리
        if (typeof value === "undefined") {
          return "undefined";
        }

        // 순환 참조 처리
        if (typeof value === "object" && value !== null) {
          try {
            JSON.stringify(value);
          } catch (error) {
            if (error.message.includes("circular")) {
              return "[Circular Reference]";
            }
          }
        }

        return value;
      },
      2,
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const methodName = context.getHandler().name;
    const requestData = context.getArgByIndex(0);
    const start = Date.now();

    try {
      this.logger.log(`[GRPC Request] ${methodName} - Request Data: ${this.safeStringify(requestData)}`);
    } catch (error) {
      this.logger.warn(`Failed to stringify request data: ${error.message}`);
    }

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - start;
          if (this.shouldBeLogged(context)) {
            try {
              this.logger.log(
                `[GRPC Response] ${methodName} - Duration: ${duration}ms - Response: ${this.safeStringify(response)}`,
              );
            } catch (error) {
              this.logger.warn(`Failed to stringify response: ${error.message}`);
            }
          }
        },
        error: () => {},
      }),
    );
  }

  private shouldBeLogged(context: ExecutionContext): boolean {
    if (
      context.getHandler().name.toLowerCase().includes("find") ||
      context.getHandler().name.toLowerCase().includes("get")
    ) {
      return false;
    }
    return true;
  }
}
