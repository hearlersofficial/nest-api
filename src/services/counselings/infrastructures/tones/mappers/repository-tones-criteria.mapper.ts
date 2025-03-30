import { ToneEntity } from "~shared/core/infrastructure/entities/counselors/Tones.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";

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
