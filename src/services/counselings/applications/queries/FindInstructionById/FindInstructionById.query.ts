import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";

import { HttpStatus } from "@nestjs/common";

export class FindInstructionByIdQuery {
  constructor(public readonly instructionId: UniqueEntityId) {
    this.validate();
  }

  validate(): void {
    if (!this.instructionId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "instructionId is required");
    }
  }
}

export interface FindInstructionByIdQueryResult {
  instruction: Instructions;
  instructionItems: InstructionItems[];
}
