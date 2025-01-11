import { HttpStatus } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";

export class ReserveTokensCommand {
  constructor(public readonly props: ReserveTokensCommandProps) {
    this.validate(props);
  }

  private validate(props: ReserveTokensCommandProps): void {
    if (props.userId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "userId는 필수입니다.");
    }
  }
}

interface ReserveTokensCommandProps {
  userId: number;
}

export interface ReserveTokensCommandResponse {
  remainingTokens: number;
  maxTokens: number;
  reserved: boolean;
}
