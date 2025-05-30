import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsCriteriaFindMany } from "~counselings/domains/personaPrompts/personaPrompts.criteria";
import { PersonaPromptsReader } from "~counselings/domains/personaPrompts/personaPrompts.reader";
import { RepositoryPersonaPromptCriteriaMapper } from "~counselings/infrastructures/personaPrompts/mappers/repository-personaPrompts-criteria.mapper";
import { PersonaPromptsRepository } from "~counselings/infrastructures/personaPrompts/personaPrompts.repository";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class RepositoryPersonaPromptsReader extends PersonaPromptsReader {
  constructor(private readonly personaPromptsRepository: PersonaPromptsRepository) {
    super();
  }

  override async findOne(props: { personaPromptId: UniqueEntityId }): Promise<PersonaPrompts | null> {
    return this.personaPromptsRepository.findByPersonaPromptId(props.personaPromptId);
  }

  override async findMany(props: PersonaPromptsCriteriaFindMany): Promise<PersonaPrompts[]> {
    const typeormOptions = RepositoryPersonaPromptCriteriaMapper.toFindManyOptions(props);
    return this.personaPromptsRepository.findMany(typeormOptions);
  }
}
