import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class FindContextByIdQuery {
  constructor(public readonly contextId: UniqueEntityId) {
    this.validate();
  }

  validate(): void {
    if (!this.contextId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "contextId is required");
    }
  }
}
