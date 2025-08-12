import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";

import { isDefined } from "~common/shared/utils/validate";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from "typeorm";

export class RepositoryCounselCriteriaMapper {
  static toFindManyOptions(criteria: CounselsCriteriaFindMany): FindManyOptions<CounselsEntity> {
    const where: FindOptionsWhere<CounselsEntity> = {};
    const order: FindOptionsOrder<CounselsEntity> = {};

    where.userId = criteria.userId.getString();

    if (isDefined(criteria.counselorId)) {
      where.counselorId = criteria.counselorId.getString();
    }

    if (criteria.orderBy) {
      order.id = criteria.orderBy.id;
    }

    return { where, order };
  }
}
