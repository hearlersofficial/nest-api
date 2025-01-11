import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";

export interface ConnectAuthChannelUseCaseResponse extends UseCaseCoreResponse {
  authUser?: AuthUsers;
}
