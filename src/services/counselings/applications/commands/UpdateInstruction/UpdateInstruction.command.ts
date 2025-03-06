import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";

import { HttpStatus } from "@nestjs/common";

interface UpdateInstructionCommandProps {
  instructionId: UniqueEntityId;
  name?: string;
  initialSentence?: string;
  instructionItemIds?: UniqueEntityId[];
}

export interface UpdateInstructionCommandResult {
  instruction: Instructions;
  instructionItems: InstructionItems[];
}

export class UpdateInstructionCommand {
  constructor(public readonly props: UpdateInstructionCommandProps) {
    this.validateProps(props);
  }
  private validateProps(props: UpdateInstructionCommandProps): void {
    if (props.instructionId === null || props.instructionId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "instructionId is required");
    }
  }
}
