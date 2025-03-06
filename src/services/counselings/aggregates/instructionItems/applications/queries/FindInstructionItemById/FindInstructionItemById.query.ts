import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class FindInstructionItemByIdQuery {
  constructor(public readonly instructionItemId: UniqueEntityId) {
    this.validate();
  }

  validate(): void {
    if (!this.instructionItemId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "instructionItemId is required");
    }
  }
}
