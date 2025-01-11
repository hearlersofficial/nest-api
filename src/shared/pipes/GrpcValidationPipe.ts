import { status } from "@grpc/grpc-js";
import { ValidationError,ValidationPipe } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class GrpcValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = this.formatErrors(errors);
        return new RpcException({
          code: status.INVALID_ARGUMENT,
          message: "Validation failed",
          details: formattedErrors,
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]): string[] {
    return errors.map((error) => {
      if (error.constraints) {
        return Object.values(error.constraints).join(", ");
      }
      return `Invalid value for ${error.property}`;
    });
  }
}
