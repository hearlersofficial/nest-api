import { Error, ErrorSchema } from "~/src/gen/com/hearlers/v1/common/error_pb";
import { RpcExceptionCode } from "~/src/shared/enums/RpcExceptionCode.enum";
import { grpcToHttpStatus, httpStatusToGrpc } from "~/src/shared/utils/Rpc.utils";

import { create } from "@bufbuild/protobuf";
import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class CustomRpcException extends RpcException {
  private errorProto: Error;

  constructor(status: number, code: RpcExceptionCode | HttpStatus, message: string) {
    const error = create(ErrorSchema, {
      status: status,
      code: code,
      details: [message],
    });
    super(error);
    this.errorProto = error;
  }
  getErrorProto(): Error {
    return this.errorProto;
  }
}

// CodeBasedRpcException 클래스 정의
export class CodeBasedRpcException extends CustomRpcException {
  constructor(code: RpcExceptionCode, message: string) {
    super(grpcToHttpStatus(code), code, message); // 상태 코드와 메시지를 CustomRpcException에 전달
  }
}

// HttpStatusBasedRpcException 클래스 정의
export class HttpStatusBasedRpcException extends CustomRpcException {
  constructor(status: HttpStatus, message: string) {
    super(status, httpStatusToGrpc(status), message); // 상태 코드와 메시지를 CustomRpcException에 전달
  }
}
