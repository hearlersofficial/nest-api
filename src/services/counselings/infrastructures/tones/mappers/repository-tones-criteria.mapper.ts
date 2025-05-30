import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";

import { isDefined } from "~common/shared/utils/Validate.utils";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryToneCriteriaMapper {
  static toFindManyOptions(criteria: TonesCriteriaFindMany): FindManyOptions<ToneEntity> {
    const where: FindOptionsWhere<ToneEntity> = {};

    if (isDefined(criteria.name)) {
      where.name = criteria.name;
    }

    return { where };
  }
}
