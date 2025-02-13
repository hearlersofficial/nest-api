import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/users/aggregates/users/applications/queries/FindOneUser/FindOneUser.query.ts
=======
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/applications/queries/FindOneUser/FindOneUser.query.ts

export class FindOneUserQuery {
  constructor(public readonly props: FindOneUserQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: FindOneUserQueryProps): void {
    if (!props.userId && !props.nickname) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "UserId or nickname is required");
    }
  }
}

interface FindOneUserQueryProps {
  userId?: UniqueEntityId;
  nickname?: string;
}
