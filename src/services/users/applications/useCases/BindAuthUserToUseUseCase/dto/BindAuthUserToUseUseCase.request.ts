import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { Users } from "~users/aggregates/users/domain/Users";

export interface BindAuthUserToUseUseCaseRequest {
  user: Users;
  authUser: AuthUsers;
}
