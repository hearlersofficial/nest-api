import { TonePromptEntity } from "~shared/core/infrastructure/entities/prompts/TonePrompts.entity";
import { TonePromptsCriteriaFindMany } from "~counselings/domains/tonePrompts/tonePrompts.criteria";

import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryTonePromptCriteriaMapper {
  static toFindManyOptions(criteria: TonePromptsCriteriaFindMany): FindManyOptions<TonePromptEntity> {
    const where: FindOptionsWhere<TonePromptEntity> = {};

    if (criteria.toneId) {
      where.toneId = criteria.toneId.getString();
    }

    return { where };
  }
}
