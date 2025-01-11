import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { Users } from "~users/aggregates/users/domain/Users";

export interface BindAuthUserToUseUseCaseResponse extends UseCaseCoreResponse {
  user?: Users;
  authUser?: AuthUsers;
}
