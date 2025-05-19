import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";

import { FindManyOptions, FindOptionsWhere, ILike, In } from "typeorm";

export class RepositoryPromptVersionCriteriaMapper {
  static toFindManyOptions(criteria: PromptVersionsCriteriaFindMany): FindManyOptions<PromptVersionEntity> {
    const where: FindOptionsWhere<PromptVersionEntity> = {};

    if (criteria.name !== undefined) {
      where.name = ILike(`%${criteria.name}%`);
    }
    if (criteria.isActive !== undefined) {
      where.isActive = criteria.isActive;
    }
    if (criteria.isTemporary !== undefined) {
      where.isTemporary = criteria.isTemporary;
    }
    if (criteria.isBookmarked !== undefined) {
      where.isBookmarked = criteria.isBookmarked;
    }
    if (criteria.ids !== undefined) {
      where.id = In(criteria.ids.map((id) => id.getString()));
    }

    return { where };
  }
}
