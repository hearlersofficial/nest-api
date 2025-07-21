import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

export type AuthUsersCriteriaUniqueKey =
  | { type: "user"; id: UserId }
  | { type: "authUser"; id: AuthUserId }
  | { type: "channelInfo"; uniqueId: string; authChannel: AuthChannel };

export type AuthUsersCriteriaFindOne = {
  userId?: UserId;
  authUserId?: AuthUserId;
  channelInfo?: {
    uniqueId?: string;
    authChannel?: AuthChannel;
  };
};

export type AuthUsersCriteriaFindMany = {
  authChannel?: AuthChannel;
};
