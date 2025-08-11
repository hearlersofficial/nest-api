import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";

import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, ILike, In, IsNull } from "typeorm";

export class RepositoryPromptVersionCriteriaMapper {
  static toFindManyOptions(criteria: PromptVersionsCriteriaFindMany): FindManyOptions<PromptVersionEntity> {
    const where: FindOptionsWhere<PromptVersionEntity> = {};
    const order: FindOptionsOrder<PromptVersionEntity> = {};
    const withDeleted = criteria.withDeleted ?? false;

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
    if (criteria.aiModel !== undefined) {
      where.aiModel = criteria.aiModel;
    }
    if (criteria.ids !== undefined) {
      where.id = In(criteria.ids.map((id) => id.getString()));
    }

    if (criteria.orderBy) {
      order.id = criteria.orderBy.id;
    }

    return { where, order, withDeleted };
  }
}
