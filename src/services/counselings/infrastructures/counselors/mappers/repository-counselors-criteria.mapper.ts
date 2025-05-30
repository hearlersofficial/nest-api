import {
  CounselorsCriteriaFindMany,
  FindManyBubblesCriteria,
} from "~counselings/domains/counselors/counselors.criteria";

import { isDefined } from "~common/shared/utils/validate";
import { BubbleEntity } from "~common/system/persistences/entities/counselors/bubble.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
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

  static toFindBubblesOptions(criteria: FindManyBubblesCriteria): FindManyOptions<BubbleEntity> {
    const where: FindOptionsWhere<BubbleEntity> = {};

    if (isDefined(criteria.counselorId)) {
      where.counselorId = criteria.counselorId.getString();
    }

    return { where };
  }
}
