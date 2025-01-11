import { HttpStatus } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";

export class CheckRemainingTokensQuery {
  constructor(public readonly props: CheckRemainingTokensQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: CheckRemainingTokensQueryProps): void {
    if (!props.userId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "UserId is required");
    }
  }
}

export interface CheckRemainingTokensQueryResponse {
  remainingTokens: number;
  maxTokens: number;
  reserved: boolean;
}

interface CheckRemainingTokensQueryProps {
  userId: number;
}
