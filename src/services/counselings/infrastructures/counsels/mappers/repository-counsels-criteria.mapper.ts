import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";

import { isDefined } from "~common/shared/utils/validate";
import { CounselsEntity } from "~common/system/persistences/entities/councels/Counsels.entity";
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
