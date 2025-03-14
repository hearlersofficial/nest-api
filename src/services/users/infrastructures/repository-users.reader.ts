import { Users } from "~users/domains/users/models/users";
import {
  UsersCriteriaFindMany,
  UsersCriteriaFindOne,
  UsersCriteriaUniqueKey,
} from "~users/domains/users/users.criteria";
import { UsersReader } from "~users/domains/users/users.reader";
import { RepositoryUserCriteriaMapper } from "~users/infrastructures/mappers/repository-users-criteria.mapper";
import { UsersRepository } from "~users/infrastructures/users.repository";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryUsersReader extends UsersReader {
  constructor(private readonly userRepository: UsersRepository) {
    super();
  }

  override async findOne(props: {
    uniqueCriteria: UsersCriteriaUniqueKey;
    options?: UsersCriteriaFindOne;
  }): Promise<Users | null> {
    const typeormOptions = RepositoryUserCriteriaMapper.toFindOneOptions(props.options);
    switch (props.uniqueCriteria.type) {
      case "user":
        return this.userRepository.findByUserId(props.uniqueCriteria.id, typeormOptions);
      case "nickname":
        return this.userRepository.findByNickname(props.uniqueCriteria.nickname, typeormOptions);
    }
  }

  override async findMany(props: UsersCriteriaFindMany): Promise<Users[]> {
    const typeormOptions = RepositoryUserCriteriaMapper.toFindManyOptions(props);
    return this.userRepository.findMany(typeormOptions);
  }
}
