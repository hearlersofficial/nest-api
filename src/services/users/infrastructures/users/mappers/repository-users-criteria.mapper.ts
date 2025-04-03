import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { UsersCriteriaFindMany, UsersCriteriaFindOne } from "~users/domains/users/users.criteria";

import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

/**
 * 도메인 필터를 인프라스트럭처 필터로 변환하는 클래스
 */
export class RepositoryUserCriteriaMapper {
  /**
   * 도메인 findOne 필터를 TypeORM FindOneOptions로 변환
   */
  static toFindOneOptions(options?: UsersCriteriaFindOne): FindOneOptions<UsersEntity> {
    if (!isDefined(options)) {
      return {};
    }

    const where: FindOptionsWhere<UsersEntity> = {};
    if (isDefined(options.userId)) {
      where.id = options.userId.getString();
    }
    if (isDefined(options.nickname)) {
      where.nickname = options.nickname;
    }
    const findOptions: FindOneOptions<UsersEntity> = { where };
    if (isDefined(options.withPessimisticWriteLock)) {
      findOptions.lock = { mode: "pessimistic_write" };
    }

    return findOptions;
  }

  /**
   * 도메인 findMany 필터를 TypeORM FindManyOptions로 변환
   */
  static toFindManyOptions(criteria: UsersCriteriaFindMany): FindManyOptions<UsersEntity> {
    const where: FindOptionsWhere<UsersEntity> = {};

    if (isDefined(criteria.nickname)) {
      where.nickname = criteria.nickname;
    }

    return { where };
  }
}
