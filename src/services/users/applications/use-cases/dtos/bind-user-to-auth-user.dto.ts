import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { Users } from "~users/domains/users/models/users";

export interface BindAuthUserToUseUseCaseRequest {
  user: Users;
  authUser: AuthUsers;
}

export interface BindAuthUserToUseUseCaseResponse extends UseCaseCoreResponse {
  user?: Users;
  authUser?: AuthUsers;
}
