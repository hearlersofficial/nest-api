import { PromptActivateHistoryEntity } from "~shared/core/infrastructure/entities/prompts/PromptActivateHistory.entity";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/promptActivateHistory/promptActivateHistory.criteria";

import { FindManyOptions, FindOptionsWhere, LessThan } from "typeorm";

export class RepositoryPromptActivateHistoryCriteriaMapper {
  static toFindManyOptions(
    criteria: PromptActivateHistoryCriteriaFindMany,
  ): FindManyOptions<PromptActivateHistoryEntity> {
    const where: FindOptionsWhere<PromptActivateHistoryEntity> = {};

    if (criteria.promptVersionId) {
      where.promptVersionId = criteria.promptVersionId.getString();
    }

    if (criteria.activatedAtBefore) {
      where.activatedAt = LessThan(criteria.activatedAtBefore.toISOString());
    }

    return { where };
  }
}
