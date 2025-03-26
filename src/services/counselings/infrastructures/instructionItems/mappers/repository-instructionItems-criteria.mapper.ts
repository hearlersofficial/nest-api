import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { InstructionItemsCriteriaFindMany } from "~counselings/domains/instructionItems/instructionItems.criteria";

import { FindManyOptions, FindOptionsWhere, ILike, In } from "typeorm";

export class RepositoryInstructionItemCriteriaMapper {
  static toFindManyOptions(criteria: InstructionItemsCriteriaFindMany): FindManyOptions<InstructionItemEntity> {
    const where: FindOptionsWhere<InstructionItemEntity> = {};

    if (isDefined(criteria.keyword)) {
      where.body = ILike(`%${criteria.keyword}%`);
    }
    if (isDefined(criteria.ids)) {
      where.id = In(criteria.ids.map((id) => id.getString()));
    }

    return { where };
  }
}
