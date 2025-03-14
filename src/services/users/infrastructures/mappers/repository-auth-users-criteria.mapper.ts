import { AuthUsersEntity } from "~shared/core/infrastructure/entities/users/AuthUsers.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { AuthUsersCriteriaFindMany, AuthUsersCriteriaFindOne } from "~users/domains/auth-users/auth-users.criteria";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

/**
 * 도메인 필터를 인프라스트럭처 필터로 변환하는 클래스
 */
export class RepositoryAuthUsersCriteriaMapper {
  /**
   * 도메인 findOne 필터를 TypeORM FindOneOptions로 변  환
   */
  static toFindOneOptions(options?: AuthUsersCriteriaFindOne): FindOneOptions<AuthUsersEntity> {
    if (!isDefined(options)) {
      return {};
    }

    const where: FindOptionsWhere<AuthUsersEntity> = {};
    if (isDefined(options.authUserId)) {
      where.id = options.authUserId.getString();
    }
    if (isDefined(options.userId)) {
      where.userId = options.userId.getString();
    }
    if (isDefined(options.channelInfo)) {
      switch (options.channelInfo.authChannel) {
        case AuthChannel.KAKAO:
          where.kakao = {
            id: options.channelInfo.uniqueId,
          };
          break;
      }
    }
    return { where };
  }

  /**
   * 도메인 findMany 필터를 TypeORM FindManyOptions로 변환
   */
  static toFindManyOptions(criteria: AuthUsersCriteriaFindMany): FindManyOptions<AuthUsersEntity> {
    const where: FindOptionsWhere<AuthUsersEntity> = {};

    if (isDefined(criteria.authChannel)) {
      where.authChannel = criteria.authChannel;
    }

    return { where };
  }
}
