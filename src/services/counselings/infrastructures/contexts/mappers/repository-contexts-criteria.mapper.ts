import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { ContextsCriteriaFindMany } from "~counselings/domains/contexts/contexts.criteria";

import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryContextCriteriaMapper {
  static toFindManyOptions(criteria: ContextsCriteriaFindMany): FindManyOptions<ContextEntity> {
    const where: FindOptionsWhere<ContextEntity> = {};

    if (isDefined(criteria.name)) {
      where.name = criteria.name;
    }

    return { where };
  }
}
