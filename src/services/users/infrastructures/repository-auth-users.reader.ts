import {
  AuthUsersCriteriaFindMany,
  AuthUsersCriteriaFindOne,
  AuthUsersCriteriaUniqueKey,
} from "~users/domains/auth-users/auth-users.criteria";
import { AuthUsersReader } from "~users/domains/auth-users/auth-users.reader";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { AuthUsersRepository } from "~users/infrastructures/auth-users.repository";
import { RepositoryAuthUsersCriteriaMapper } from "~users/infrastructures/mappers/repository-auth-users-criteria.mapper";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryAuthUsersReader extends AuthUsersReader {
  constructor(private readonly authUserRepository: AuthUsersRepository) {
    super();
  }

  override async findOne(props: {
    uniqueCriteria: AuthUsersCriteriaUniqueKey;
    options?: AuthUsersCriteriaFindOne;
  }): Promise<AuthUsers | null> {
    const typeormOptions = RepositoryAuthUsersCriteriaMapper.toFindOneOptions(props.options);
    switch (props.uniqueCriteria.type) {
      case "user":
        return this.authUserRepository.findByUserId(props.uniqueCriteria.id, typeormOptions);
      case "authUser":
        return this.authUserRepository.findByAuthUserId(props.uniqueCriteria.id, typeormOptions);
      case "channelInfo":
        return this.authUserRepository.findByChannelInfo(
          {
            uniqueId: props.uniqueCriteria.uniqueId,
            authChannel: props.uniqueCriteria.authChannel,
          },
          typeormOptions,
        );
    }
  }

  override async findMany(props: AuthUsersCriteriaFindMany): Promise<AuthUsers[]> {
    const typeormOptions = RepositoryAuthUsersCriteriaMapper.toFindManyOptions(props);
    return this.authUserRepository.findMany(typeormOptions);
  }
}
