import { RepositoryPersonaPromptCriteriaMapper } from "~counselings/domains/personaPrompts/infrastructures/mappers/repository-personaPrompts-criteria.mapper";
import { PersonaPromptsRepository } from "~counselings/domains/personaPrompts/infrastructures/personaPrompts.repository";
import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsCriteriaFindMany } from "~counselings/domains/personaPrompts/personaPrompts.criteria";
import { PersonaPromptsReader } from "~counselings/domains/personaPrompts/personaPrompts.reader";

import { Injectable } from "@nestjs/common";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";

@Injectable()
export class RepositoryPersonaPromptsReader extends PersonaPromptsReader {
  constructor(private readonly personaPromptsRepository: PersonaPromptsRepository) {
    super();
  }

  override async findOne(props: { personaPromptId: PersonaPromptId }): Promise<PersonaPrompts | null> {
    return this.personaPromptsRepository.findByPersonaPromptId(props.personaPromptId);
  }

  override async findMany(props: PersonaPromptsCriteriaFindMany): Promise<PersonaPrompts[]> {
    const typeormOptions = RepositoryPersonaPromptCriteriaMapper.toFindManyOptions(props);
    return this.personaPromptsRepository.findMany(typeormOptions);
  }
}
