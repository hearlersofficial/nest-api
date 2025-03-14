import {
  AuthUsersCriteriaFindMany,
  AuthUsersCriteriaFindOne,
  AuthUsersCriteriaUniqueKey,
} from "~users/domains/auth-users/auth-users.criteria";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";

export abstract class AuthUsersReader {
  abstract findOne(props: {
    uniqueCriteria: AuthUsersCriteriaUniqueKey;
    options?: AuthUsersCriteriaFindOne;
  }): Promise<AuthUsers | null>;
  abstract findMany(props: AuthUsersCriteriaFindMany): Promise<AuthUsers[]>;
}
