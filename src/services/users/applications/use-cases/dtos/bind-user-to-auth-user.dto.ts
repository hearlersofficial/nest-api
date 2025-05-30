import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { Users } from "~users/domains/users/models/users";

import { UseCaseCoreResponse } from "~common/shared-kernel/interfaces/UseCase.response";

export interface BindAuthUserToUseUseCaseRequest {
  user: Users;
  authUser: AuthUsers;
}

export interface BindAuthUserToUseUseCaseResponse extends UseCaseCoreResponse {
  user?: Users;
  authUser?: AuthUsers;
}
