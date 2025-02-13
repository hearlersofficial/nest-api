import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/users/aggregates/users/applications/commands/ConsumeTokens/ConsumeTokens.command.ts
=======
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/applications/commands/ConsumeTokens/ConsumeTokens.command.ts

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
