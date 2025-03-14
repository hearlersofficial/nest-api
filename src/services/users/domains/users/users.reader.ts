import { Users } from "~users/domains/users/models/Users";
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
}
