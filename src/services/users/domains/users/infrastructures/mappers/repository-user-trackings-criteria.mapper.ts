import * as UserTrackingsCriteria from "~users/domains/users/user-trackings.criteria";

import { isDefined } from "~common/shared/utils/validate";
import { UserTrackingsEntity } from "~common/system/persistences/entities/users/user-trackings.entity";
import { FindOneOptions, FindOptionsWhere } from "typeorm";
/**
 * 도메인 필터를 인프라스트럭처 필터로 변환하는 클래스
 */
export class RepositoryUserTrackingsCriteriaMapper {
  /**
   * 도메인 findOne 필터를 TypeORM FindOneOptions로 변환
   */
  static toFindOneOptions(options?: UserTrackingsCriteria.FindOneOptions): FindOneOptions<UserTrackingsEntity> {
    if (!isDefined(options)) {
      return {};
    }

    const where: FindOptionsWhere<UserTrackingsEntity> = {};
    if (isDefined(options.userId)) {
      where.id = options.userId.getString();
    }
    if (isDefined(options.userId)) {
      where.userId = options.userId.getString();
    }
    const findOptions: FindOneOptions<UserTrackingsEntity> = { where };

    return findOptions;
  }
}
