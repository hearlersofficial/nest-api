<<<<<<< HEAD:src/services/users/aggregates/authUsers/applications/queries/FindOneAuthUser/FindOneAuthUser.query.ts
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";
=======
import { HttpStatus } from "@nestjs/common";
import { AuthUsers } from "~/src/aggregates/authUsers/domain/AuthUsers";
import { AuthChannel } from "~/src/gen/com/hearlers/v1/model/auth_user_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/authUsers/applications/queries/FindOneAuthUser/FindOneAuthUser.query.ts

import { HttpStatus } from "@nestjs/common";
export class FindOneAuthUserQuery {
  constructor(public readonly props: FindOneAuthUserQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: FindOneAuthUserQueryProps): void {
    if (!props.authUserId && !props.userId && !props.authChannel && !props.uniqueId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Invalid request");
    }
    if ((props.uniqueId && !props.authChannel) || (props.authChannel && !props.uniqueId)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Both uniqueId and authChannel are required");
    }
  }
}

export interface FindOneAuthUserQueryProps {
  authUserId?: UniqueEntityId;
  userId?: UniqueEntityId;
  authChannel?: AuthChannel;
  uniqueId?: string;
}

export class FindOneAuthUserQueryResult {
  authUser: AuthUsers;
}
