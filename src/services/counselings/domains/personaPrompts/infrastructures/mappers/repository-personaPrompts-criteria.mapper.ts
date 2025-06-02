import { PersonaPromptsCriteriaFindMany } from "~counselings/domains/personaPrompts/personaPrompts.criteria";

import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/PersonaPrompts.entity";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryPersonaPromptCriteriaMapper {
  static toFindManyOptions(criteria: PersonaPromptsCriteriaFindMany): FindManyOptions<PersonaPromptEntity> {
    const where: FindOptionsWhere<PersonaPromptEntity> = {};

    if (criteria.counselorId) {
      where.counselorId = criteria.counselorId.getString();
    }

    return { where };
  }
}
