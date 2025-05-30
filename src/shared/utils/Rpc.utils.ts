import { create } from "@bufbuild/protobuf";
import { status } from "@grpc/grpc-js";
import { HttpStatus } from "@nestjs/common"; // NestJS HTTP 상태 코드
// gRPC 오류 코드를 HTTP 상태 코드로 변환하는 함수
export function grpcToHttpStatus(code: status): HttpStatus {
  switch (code) {
    case status.OK:
      return HttpStatus.OK;
    case status.CANCELLED:
      return HttpStatus.BAD_REQUEST; // 또는 499
    case status.UNKNOWN:
      return HttpStatus.INTERNAL_SERVER_ERROR;
    case status.INVALID_ARGUMENT:
      return HttpStatus.BAD_REQUEST;
    case status.DEADLINE_EXCEEDED:
      return HttpStatus.GATEWAY_TIMEOUT;
    case status.NOT_FOUND:
      return HttpStatus.NOT_FOUND;
    case status.ALREADY_EXISTS:
      return HttpStatus.CONFLICT;
    case status.PERMISSION_DENIED:
      return HttpStatus.FORBIDDEN;
    case status.UNAUTHENTICATED:
      return HttpStatus.UNAUTHORIZED;
    case status.RESOURCE_EXHAUSTED:
      return HttpStatus.TOO_MANY_REQUESTS;
    case status.FAILED_PRECONDITION:
      return HttpStatus.BAD_REQUEST;
    case status.ABORTED:
      return HttpStatus.CONFLICT;
    case status.OUT_OF_RANGE:
      return HttpStatus.BAD_REQUEST;
    case status.UNIMPLEMENTED:
      return HttpStatus.NOT_IMPLEMENTED;
    case status.INTERNAL:
      return HttpStatus.INTERNAL_SERVER_ERROR;
    case status.UNAVAILABLE:
      return HttpStatus.SERVICE_UNAVAILABLE;
    case status.DATA_LOSS:
      return HttpStatus.INTERNAL_SERVER_ERROR;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR; // 기본값
  }
}

// HTTP 상태 코드를 gRPC 오류 코드로 변환하는 함수
export function httpStatusToGrpc(httpStatus: HttpStatus): status {
  switch (httpStatus) {
    case HttpStatus.OK:
      return status.OK;
    case HttpStatus.BAD_REQUEST:
      return status.INVALID_ARGUMENT;
    case HttpStatus.UNAUTHORIZED:
      return status.UNAUTHENTICATED;
    case HttpStatus.FORBIDDEN:
      return status.PERMISSION_DENIED;
    case HttpStatus.NOT_FOUND:
      return status.NOT_FOUND;
    case HttpStatus.CONFLICT:
      return status.ALREADY_EXISTS;
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return status.INTERNAL;
    case HttpStatus.SERVICE_UNAVAILABLE:
      return status.UNAVAILABLE;
    default:
      return status.UNKNOWN; // 기본값
  }
}

export function ProtoRequest(schema: any, paramIdx = 0) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      args[paramIdx] = create(schema, args[paramIdx]); // bufbuild용
      return original.apply(this, args);
    };
    return descriptor;
  };
}
