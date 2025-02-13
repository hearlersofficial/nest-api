import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";
export interface FindOneAuthUserUseCaseRequest {
  userId?: UniqueEntityId;
  authUserId?: UniqueEntityId;
  channelInfo?: {
    uniqueId?: string;
    authChannel?: AuthChannel;
  };
}
