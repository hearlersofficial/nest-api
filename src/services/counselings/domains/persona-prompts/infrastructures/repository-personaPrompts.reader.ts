import { RepositoryPersonaPromptCriteriaMapper } from "~counselings/domains/persona-prompts/infrastructures/mappers/repository-persona-prompts-criteria.mapper";
import { PersonaPromptsRepository } from "~counselings/domains/persona-prompts/infrastructures/persona-prompts.repository";
import { PersonaPrompts } from "~counselings/domains/persona-prompts/models/persona-prompts";
import * as PersonaPromptsCriteria from "~counselings/domains/persona-prompts/persona-prompts.criteria";
import { PersonaPromptsReader } from "~counselings/domains/persona-prompts/persona-prompts.reader";

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

  override async findMany(props: PersonaPromptsCriteria.FindManyOptions): Promise<PersonaPrompts[]> {
    const typeormOptions = RepositoryPersonaPromptCriteriaMapper.toFindManyOptions(props);
    return this.personaPromptsRepository.findMany(typeormOptions);
  }
}
