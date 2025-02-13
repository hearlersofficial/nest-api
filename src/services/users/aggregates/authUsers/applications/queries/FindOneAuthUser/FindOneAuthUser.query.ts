import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

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
