import { AuthUsers, AuthUsersNewProps } from "~users/domains/auth-users/models/auth-users";

export abstract class AuthUsersStore {
  abstract create(newProps: AuthUsersNewProps): Promise<AuthUsers>;
  abstract update(authUser: AuthUsers): Promise<AuthUsers>;
  abstract updateMany(authUsers: AuthUsers[]): Promise<AuthUsers[]>;
}
