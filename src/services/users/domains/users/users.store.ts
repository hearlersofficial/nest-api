import { UserTrackings } from "~users/domains/users/models/user-trackings";
import { Users, UsersNewProps } from "~users/domains/users/models/users";

export abstract class UsersStore {
  abstract create(user: UsersNewProps): Promise<Users>;
  abstract update(user: Users): Promise<Users>;
  abstract updateMany(users: Users[]): Promise<Users[]>;

  abstract saveUserTracking(userTracking: UserTrackings): Promise<UserTrackings>;
}
