import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

export interface FindOneUserUseCaseRequest {
  userId?: number;
  nickname?: string;
  authChannel?: AuthChannel;
  uniqueId?: string;
}
