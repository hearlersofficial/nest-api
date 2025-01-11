import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";

export interface UpdateAuthUserUseCaseResponse extends UseCaseCoreResponse {
  authUser?: AuthUsers;
}
