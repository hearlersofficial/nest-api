import { Users, UsersNewProps } from "~users/domains/users/models/users";
import { UsersCriteriaFindOne, UsersCriteriaUniqueKey } from "~users/domains/users/users.criteria";
import { UsersPersistor } from "~users/domains/users/users.persistor";
import { UsersReader } from "~users/domains/users/users.reader";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class UsersService {
  constructor(
    private readonly userReader: UsersReader,
    private readonly userPersistor: UsersPersistor,
  ) {}

  async findOne(props: {
    uniqueCriteria: UsersCriteriaUniqueKey;
    options?: UsersCriteriaFindOne;
  }): Promise<Users | null> {
    return this.userReader.findOne(props);
  }

  async getOne(props: { uniqueCriteria: UsersCriteriaUniqueKey; options?: UsersCriteriaFindOne }): Promise<Users> {
    const user = await this.findOne(props);
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "User not found");
    }
    return user;
  }

  async create(user: UsersNewProps): Promise<Users> {
    return this.userPersistor.create(user);
  }

  async update(user: Users): Promise<Users> {
    return this.userPersistor.update(user);
  }
}
