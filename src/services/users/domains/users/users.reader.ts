import { UserTrackings } from "~users/domains/users/models/user-trackings";
import { Users } from "~users/domains/users/models/users";
import * as UserTrackingsCriteria from "~users/domains/users/user-trackings.criteria";
import {
  UsersCriteriaFindMany,
  UsersCriteriaFindOne,
  UsersCriteriaUniqueKey,
} from "~users/domains/users/users.criteria";

export abstract class UsersReader {
  abstract findOne(props: {
    uniqueCriteria: UsersCriteriaUniqueKey;
    options?: UsersCriteriaFindOne;
  }): Promise<Users | null>;
  abstract findMany(props: UsersCriteriaFindMany): Promise<Users[]>;

  abstract findOneTracking(props: {
    uniqueCriteria: UserTrackingsCriteria.UniqueKey;
    options?: UserTrackingsCriteria.FindOneOptions;
  }): Promise<UserTrackings | null>;
}
