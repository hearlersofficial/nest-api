import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";

export interface CreateAuthUserUseCaseResponse extends UseCaseCoreResponse {
  authUser?: AuthUsers;
}
