import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/users/aggregates/users/applications/commands/ReserveTokens/ReserveTokens.command.ts
=======
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/applications/commands/ReserveTokens/ReserveTokens.command.ts

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
  userId: UniqueEntityId;
}

export interface ReserveTokensCommandResponse {
  remainingTokens: number;
  maxTokens: number;
  reserved: boolean;
}
