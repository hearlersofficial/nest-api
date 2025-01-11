import { RpcExceptionCode } from "~/src/shared/enums/RpcExceptionCode.enum";

import { HttpStatus } from "@nestjs/common"; // NestJS HTTP 상태 코드

// gRPC 오류 코드를 HTTP 상태 코드로 변환하는 함수
export function grpcToHttpStatus(code: RpcExceptionCode): HttpStatus {
  switch (code) {
    case RpcExceptionCode.OK:
      return HttpStatus.OK;
    case RpcExceptionCode.CANCELLED:
      return HttpStatus.BAD_REQUEST; // 또는 499
    case RpcExceptionCode.UNKNOWN:
      return HttpStatus.INTERNAL_SERVER_ERROR;
    case RpcExceptionCode.INVALID_ARGUMENT:
      return HttpStatus.BAD_REQUEST;
    case RpcExceptionCode.DEADLINE_EXCEEDED:
      return HttpStatus.GATEWAY_TIMEOUT;
    case RpcExceptionCode.NOT_FOUND:
      return HttpStatus.NOT_FOUND;
    case RpcExceptionCode.ALREADY_EXISTS:
      return HttpStatus.CONFLICT;
    case RpcExceptionCode.PERMISSION_DENIED:
      return HttpStatus.FORBIDDEN;
    case RpcExceptionCode.UNAUTHENTICATED:
      return HttpStatus.UNAUTHORIZED;
    case RpcExceptionCode.RESOURCE_EXHAUSTED:
      return HttpStatus.TOO_MANY_REQUESTS;
    case RpcExceptionCode.FAILED_PRECONDITION:
      return HttpStatus.BAD_REQUEST;
    case RpcExceptionCode.ABORTED:
      return HttpStatus.CONFLICT;
    case RpcExceptionCode.OUT_OF_RANGE:
      return HttpStatus.BAD_REQUEST;
    case RpcExceptionCode.UNIMPLEMENTED:
      return HttpStatus.NOT_IMPLEMENTED;
    case RpcExceptionCode.INTERNAL:
      return HttpStatus.INTERNAL_SERVER_ERROR;
    case RpcExceptionCode.UNAVAILABLE:
      return HttpStatus.SERVICE_UNAVAILABLE;
    case RpcExceptionCode.DATA_LOSS:
      return HttpStatus.INTERNAL_SERVER_ERROR;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR; // 기본값
  }
}

// HTTP 상태 코드를 gRPC 오류 코드로 변환하는 함수
export function httpStatusToGrpc(status: HttpStatus): RpcExceptionCode {
  switch (status) {
    case HttpStatus.OK:
      return RpcExceptionCode.OK;
    case HttpStatus.BAD_REQUEST:
      return RpcExceptionCode.INVALID_ARGUMENT;
    case HttpStatus.UNAUTHORIZED:
      return RpcExceptionCode.UNAUTHENTICATED;
    case HttpStatus.FORBIDDEN:
      return RpcExceptionCode.PERMISSION_DENIED;
    case HttpStatus.NOT_FOUND:
      return RpcExceptionCode.NOT_FOUND;
    case HttpStatus.CONFLICT:
      return RpcExceptionCode.ALREADY_EXISTS;
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return RpcExceptionCode.INTERNAL;
    case HttpStatus.SERVICE_UNAVAILABLE:
      return RpcExceptionCode.UNAVAILABLE;
    default:
      return RpcExceptionCode.UNKNOWN; // 기본값
  }
}
