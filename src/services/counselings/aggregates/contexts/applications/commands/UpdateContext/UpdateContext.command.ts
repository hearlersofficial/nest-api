import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

interface UpdateContextCommandProps {
  contextId: UniqueEntityId;
  name?: string;
  body?: string;
  placeholders?: string[];
}

export class UpdateContextCommand {
  constructor(public readonly props: UpdateContextCommandProps) {
    this.validateProps(props);
  }
  private validateProps(props: UpdateContextCommandProps): void {
    if (props.contextId === null || props.contextId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "contextId는 필수입니다.");
    }
  }
}
