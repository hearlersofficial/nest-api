import {
  AuthUsersCriteriaFindMany,
  AuthUsersCriteriaFindOne,
  AuthUsersCriteriaUniqueKey,
} from "~users/domains/auth-users/auth-users.criteria";
import { AuthUsersPersistor } from "~users/domains/auth-users/auth-users.persistor";
import { AuthUsersReader } from "~users/domains/auth-users/auth-users.reader";
import { AuthUsers, AuthUsersNewProps } from "~users/domains/auth-users/models/auth-users";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class AuthUsersService {
  constructor(
    private readonly authUsersReader: AuthUsersReader,
    private readonly authUsersPersistor: AuthUsersPersistor,
  ) {}

  async create(newProps: AuthUsersNewProps): Promise<AuthUsers> {
    return this.authUsersPersistor.create(newProps);
  }

  async update(authUser: AuthUsers): Promise<AuthUsers> {
    return this.authUsersPersistor.update(authUser);
  }

  async findOne(props: {
    uniqueCriteria: AuthUsersCriteriaUniqueKey;
    options?: AuthUsersCriteriaFindOne;
  }): Promise<AuthUsers | null> {
    return this.authUsersReader.findOne(props);
  }

  async getOne(props: { uniqueCriteria: AuthUsersCriteriaUniqueKey }): Promise<AuthUsers> {
    const authUser = await this.findOne(props);
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Auth user not found");
    }
    return authUser;
  }

  async findMany(props: AuthUsersCriteriaFindMany): Promise<AuthUsers[]> {
    return this.authUsersReader.findMany(props);
  }
}
