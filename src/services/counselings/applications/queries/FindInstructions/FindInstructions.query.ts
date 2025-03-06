// import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";

// import { HttpStatus } from "@nestjs/common";

export interface FindInstructionsQueryProps {
  name?: string;
}

export class FindInstructionsQuery {
  constructor(public readonly props: FindInstructionsQueryProps) {
    this.validate();
  }

  validate(): void {
    // if (!this.props.name) {
    //   throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "name is required");
    // }
  }
}

export interface FindInstructionsQueryResult {
  instructions: {
    instruction: Instructions;
    instructionItems: InstructionItems[];
  }[];
}
