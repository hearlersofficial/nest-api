import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";

import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryCounselCriteriaMapper {
  static toFindManyOptions(criteria: CounselsCriteriaFindMany): FindManyOptions<CounselsEntity> {
    const where: FindOptionsWhere<CounselsEntity> = {};

    where.userId = criteria.userId.getString();

    if (isDefined(criteria.counselorId)) {
      where.counselorId = criteria.counselorId.getString();
    }

    return { where };
  }
}
