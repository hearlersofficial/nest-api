import { HttpStatus } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";

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
  userId: number;
}

export interface ConsumeTokensCommandResponse {
  remainingTokens: number;
  maxTokens: number;
}
