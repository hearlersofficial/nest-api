import * as TonePromptsCriteria from "~counselings/domains/tone-prompts/tone-prompts.criteria";

import { TonePromptEntity } from "~common/system/persistences/entities/prompts/tone-prompts.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

export class RepositoryTonePromptCriteriaMapper {
  static toFindOneOptions(criteria: TonePromptsCriteria.FindOneOptions): FindOneOptions<TonePromptEntity> {
    const where: FindOptionsWhere<TonePromptEntity> = {};

    if (criteria.promptVersionId) {
      where.promptVersionId = criteria.promptVersionId.getString();
    }

    return { where };
  }

  static toFindManyOptions(criteria: TonePromptsCriteria.FindManyOptions): FindManyOptions<TonePromptEntity> {
    const where: FindOptionsWhere<TonePromptEntity> = {};

    if (criteria.toneId) {
      where.toneId = criteria.toneId.getString();
    }

    return { where };
  }
}
