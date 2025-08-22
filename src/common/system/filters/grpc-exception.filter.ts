import { status } from "@grpc/grpc-js";
import { ArgumentsHost, Catch, HttpStatus, Logger } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { CustomRpcException, HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
@Catch()
export class AllExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof CustomRpcException) {
      this.logger.error(
        `code: ${Object.keys(status)[exception.getError().code]} | message: ${exception.getError().message}`,
        exception.stack,
      );
    } else if (exception instanceof RpcException) {
      this.logger.error(`${exception.stack}`);
    } else {
      this.logger.error(`${exception.stack}`);

      return super.catch(
        new HttpStatusBasedRpcException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "코드 베이스 내 잘못된 예외 선언 발생, 캐치 실패",
        ),
        host,
      );
    }

    return super.catch(exception, host);
  }
}
