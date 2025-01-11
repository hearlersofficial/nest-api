import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

export interface FindOneAuthUserUseCaseRequest {
  userId?: number;
  authUserId?: number;
  channelInfo?: {
    uniqueId?: string;
    authChannel?: AuthChannel;
  };
}
