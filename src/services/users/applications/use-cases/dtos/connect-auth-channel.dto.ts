import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

export interface ConnectAuthChannelUseCaseRequest {
  userId: UniqueEntityId;
  channelInfo: {
    uniqueId: string;
    authChannel: AuthChannel;
  };
}

export interface ConnectAuthChannelUseCaseResponse extends UseCaseCoreResponse {
  authUser?: AuthUsers;
}
