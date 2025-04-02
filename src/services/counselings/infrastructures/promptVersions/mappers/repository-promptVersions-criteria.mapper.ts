import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";

import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryPromptVersionCriteriaMapper {
  static toFindManyOptions(criteria: PromptVersionsCriteriaFindMany): FindManyOptions<PromptVersionEntity> {
    const where: FindOptionsWhere<PromptVersionEntity> = {};

    if (criteria.name) {
      where.name = criteria.name;
    }
    if (criteria.isActive) {
      where.isActive = criteria.isActive;
    }
    if (criteria.isTemporary) {
      where.isTemporary = criteria.isTemporary;
    }

    return { where };
  }
}
