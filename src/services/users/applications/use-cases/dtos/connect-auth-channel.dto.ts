import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UseCaseCoreResponse } from "~common/shared-kernel/interfaces/UseCase.response";

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
