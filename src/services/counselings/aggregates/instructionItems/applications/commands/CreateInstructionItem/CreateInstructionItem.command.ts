import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";

import { HttpStatus } from "@nestjs/common";

interface CreateInstructionItemCommandProps {
  body: string;
}

export interface CreateInstructionItemCommandResponse {
  instructionItem: InstructionItems;
}

export class CreateInstructionItemCommand {
  constructor(public readonly props: CreateInstructionItemCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: CreateInstructionItemCommandProps): void {
    if (!isDefined(props.body)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Body is required");
    }
  }
}
