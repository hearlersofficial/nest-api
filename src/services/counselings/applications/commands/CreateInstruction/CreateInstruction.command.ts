import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";

import { HttpStatus } from "@nestjs/common";

interface CreateInstructionCommandProps {
  name: string;
  initialSentence?: string;
  instructionItemIds?: UniqueEntityId[];
}

export interface CreateInstructionCommandResult {
  instruction: Instructions;
  instructionItems: InstructionItems[];
}

export class CreateInstructionCommand {
  constructor(public readonly props: CreateInstructionCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: CreateInstructionCommandProps): void {
    if (!isDefined(props.name)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Name is required");
    }
  }
}
