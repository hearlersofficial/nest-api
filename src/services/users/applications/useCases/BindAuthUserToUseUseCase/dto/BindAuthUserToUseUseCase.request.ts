import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { Users } from "~users/domains/users/models/Users";

export interface BindAuthUserToUseUseCaseRequest {
  user: Users;
  authUser: AuthUsers;
}
