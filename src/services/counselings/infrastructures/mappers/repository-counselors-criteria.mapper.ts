import { CounselorsEntity } from "~shared/core/infrastructure/entities/counselors/Counselors.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselorsCriteriaFindMany } from "~counselings/domains/counselors/counselors.criteria";

import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryCounselorCriteriaMapper {
  static toFindManyOptions(criteria: CounselorsCriteriaFindMany): FindManyOptions<CounselorsEntity> {
    const where: FindOptionsWhere<CounselorsEntity> = {};

    if (isDefined(criteria.name)) {
      where.name = criteria.name;
    }
    if (isDefined(criteria.toneId)) {
      where.toneId = criteria.toneId.getString();
    }

    return { where };
  }
}
