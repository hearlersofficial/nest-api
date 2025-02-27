import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class FindToneByIdQuery {
  constructor(public readonly toneId: UniqueEntityId) {
    this.validate();
  }

  validate(): void {
    if (!this.toneId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "toneId is required");
    }
  }
}
