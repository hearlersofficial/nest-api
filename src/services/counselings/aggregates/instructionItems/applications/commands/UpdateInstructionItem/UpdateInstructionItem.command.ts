import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

interface UpdateInstructionItemCommandProps {
  instructionItemId: UniqueEntityId;
  body?: string;
}

export class UpdateInstructionItemCommand {
  constructor(public readonly props: UpdateInstructionItemCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: UpdateInstructionItemCommandProps): void {
    if (props.instructionItemId === null || props.instructionItemId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "instructionItemId is required");
    }
  }
}
