import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/prompt-activate-history/prompt-activate-history.criteria";

import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/PromptActivateHistory.entity";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, LessThan } from "typeorm";

export class RepositoryPromptActivateHistoryCriteriaMapper {
  static toFindManyOptions(
    criteria: PromptActivateHistoryCriteriaFindMany,
  ): FindManyOptions<PromptActivateHistoryEntity> {
    const where: FindOptionsWhere<PromptActivateHistoryEntity> = {};
    const order: FindOptionsOrder<PromptActivateHistoryEntity> = {};

    if (criteria.promptVersionId) {
      where.promptVersionId = criteria.promptVersionId.getString();
    }

    if (criteria.activatedAtBefore) {
      where.activatedAt = LessThan(criteria.activatedAtBefore.toISOString());
    }

    if (criteria.orderBy) {
      order.id = criteria.orderBy.id;
    }

    return { where, order };
  }
}
