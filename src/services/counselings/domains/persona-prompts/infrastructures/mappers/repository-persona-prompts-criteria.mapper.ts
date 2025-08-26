import * as PersonaPromptsCriteria from "~counselings/domains/persona-prompts/persona-prompts.criteria";

import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/persona-prompts.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

export class RepositoryPersonaPromptCriteriaMapper {
  static toFindOneOptions(criteria: PersonaPromptsCriteria.FindOneOptions): FindOneOptions<PersonaPromptEntity> {
    const where: FindOptionsWhere<PersonaPromptEntity> = {};

    if (criteria.promptVersionId) {
      where.promptVersionId = criteria.promptVersionId.getString();
    }

    return { where };
  }

  static toFindManyOptions(criteria: PersonaPromptsCriteria.FindManyOptions): FindManyOptions<PersonaPromptEntity> {
    const where: FindOptionsWhere<PersonaPromptEntity> = {};

    if (criteria.counselorId) {
      where.counselorId = criteria.counselorId.getString();
    }

    if (criteria.promptVersionId) {
      where.promptVersionId = criteria.promptVersionId.getString();
    }

    return { where };
  }
}
