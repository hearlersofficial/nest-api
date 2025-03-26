import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { isDefined } from "~shared/utils/Validate.utils";
import { InstructionsCriteriaFindMany } from "~counselings/domains/instructions/instructions.criteria";

import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryInstructionCriteriaMapper {
  static toFindManyOptions(criteria: InstructionsCriteriaFindMany): FindManyOptions<InstructionEntity> {
    const where: FindOptionsWhere<InstructionEntity> = {};

    if (isDefined(criteria.name)) {
      where.name = criteria.name;
    }

    return { where };
  }
}
