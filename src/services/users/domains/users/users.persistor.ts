import { Users, UsersNewProps } from "~users/domains/users/models/users";

export abstract class UsersPersistor {
  abstract create(user: UsersNewProps): Promise<Users>;
  abstract update(user: Users): Promise<Users>;
  abstract updateMany(users: Users[]): Promise<Users[]>;
}
