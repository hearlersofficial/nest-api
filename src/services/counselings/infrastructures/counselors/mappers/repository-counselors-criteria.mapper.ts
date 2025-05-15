import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselorsCriteriaFindMany } from "~counselings/domains/counselors/counselors.criteria";

import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryCounselorCriteriaMapper {
  static toFindManyOptions(criteria: CounselorsCriteriaFindMany): FindManyOptions<CounselorEntity> {
    const where: FindOptionsWhere<CounselorEntity> = {};

    if (isDefined(criteria.name)) {
      where.name = criteria.name;
    }
    if (isDefined(criteria.toneId)) {
      where.toneId = criteria.toneId.getString();
    }

    return { where };
  }
}
