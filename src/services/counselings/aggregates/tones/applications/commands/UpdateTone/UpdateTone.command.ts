import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

interface UpdateToneCommandProps {
  toneId: UniqueEntityId;
  name: string;
  body: string;
}

export class UpdateToneCommand {
  constructor(public readonly props: UpdateToneCommandProps) {
    this.validateProps(props);
  }
  private validateProps(props: UpdateToneCommandProps): void {
    if (props.toneId === null || props.toneId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "toneId는 필수입니다.");
    }
  }
}
