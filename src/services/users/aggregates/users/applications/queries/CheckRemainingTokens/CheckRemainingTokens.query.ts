import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/users/aggregates/users/applications/queries/CheckRemainingTokens/CheckRemainingTokens.query.ts
=======
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/applications/queries/CheckRemainingTokens/CheckRemainingTokens.query.ts

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
  userId: UniqueEntityId;
}
