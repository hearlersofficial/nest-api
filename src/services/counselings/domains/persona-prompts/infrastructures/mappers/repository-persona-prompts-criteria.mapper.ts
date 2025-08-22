import * as PersonaPromptsCriteria from "~counselings/domains/persona-prompts/persona-prompts.criteria";

import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/persona-prompts.entity";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryPersonaPromptCriteriaMapper {
  static toFindManyOptions(criteria: PersonaPromptsCriteria.FindManyOptions): FindManyOptions<PersonaPromptEntity> {
    const where: FindOptionsWhere<PersonaPromptEntity> = {};

    if (criteria.counselorId) {
      where.counselorId = criteria.counselorId.getString();
    }

    return { where };
  }
}
