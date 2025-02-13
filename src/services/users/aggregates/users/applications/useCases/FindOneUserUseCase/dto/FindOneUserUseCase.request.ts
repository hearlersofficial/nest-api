import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

export interface FindOneUserUseCaseRequest {
  userId?: UniqueEntityId;
  nickname?: string;
  authChannel?: AuthChannel;
  uniqueId?: string;
}
