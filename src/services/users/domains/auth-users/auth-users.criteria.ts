import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";

export type AuthUsersCriteriaUniqueKey =
  | { type: "user"; id: UniqueEntityId }
  | { type: "authUser"; id: UniqueEntityId }
  | { type: "channelInfo"; uniqueId: string; authChannel: AuthChannel };

export type AuthUsersCriteriaFindOne = {
  userId?: UniqueEntityId;
  authUserId?: UniqueEntityId;
  channelInfo?: {
    uniqueId?: string;
    authChannel?: AuthChannel;
  };
};

export type AuthUsersCriteriaFindMany = {
  authChannel?: AuthChannel;
};
