import { httpStatusToGrpc } from "~shared/utils/Rpc.utils";

import { status } from "@grpc/grpc-js";
import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class CustomRpcException extends RpcException {
  constructor(code: status, message: string) {
    super({
      code,
      message,
    });
  }

  override getError(): { code: status; message: string } {
    return super.getError() as { code: status; message: string };
  }
}
// CodeBasedRpcException 클래스 정의
export class CodeBasedRpcException extends CustomRpcException {
  constructor(code: status, message: string) {
    super(code, message);
  }
}

// HttpStatusBasedRpcException 클래스 정의
export class HttpStatusBasedRpcException extends CustomRpcException {
  constructor(httpStatus: HttpStatus, message: string) {
    super(httpStatusToGrpc(httpStatus), message);
  }
}
