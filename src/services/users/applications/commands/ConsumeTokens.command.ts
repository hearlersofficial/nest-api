import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class ConsumeTokensCommand {
  constructor(public readonly props: ConsumeTokensCommandProps) {
    this.validate(props);
  }

  private validate(props: ConsumeTokensCommandProps): void {
    if (props.userId === undefined || props.userId === null) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "userId는 필수입니다.");
    }
  }
}

interface ConsumeTokensCommandProps {
  userId: UniqueEntityId;
}

export interface ConsumeTokensCommandResponse {
  remainingTokens: number;
  maxTokens: number;
}
