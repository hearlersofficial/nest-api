import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";

export interface ConnectAuthChannelUseCaseResponse extends UseCaseCoreResponse {
  authUser?: AuthUsers;
}
