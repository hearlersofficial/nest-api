import { RepositoryPersonaPromptCriteriaMapper } from "~counselings/domains/persona-prompts/infrastructures/mappers/repository-persona-prompts-criteria.mapper";
import { PersonaPromptsRepository } from "~counselings/domains/persona-prompts/infrastructures/persona-prompts.repository";
import { PersonaPrompts } from "~counselings/domains/persona-prompts/models/persona-prompts";
import * as PersonaPromptsCriteria from "~counselings/domains/persona-prompts/persona-prompts.criteria";
import { PersonaPromptsReader } from "~counselings/domains/persona-prompts/persona-prompts.reader";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryPersonaPromptsReader extends PersonaPromptsReader {
  constructor(private readonly personaPromptsRepository: PersonaPromptsRepository) {
    super();
  }

  override async findOne(props: {
    uniqueCriteria: PersonaPromptsCriteria.UniqueKey;
    options?: PersonaPromptsCriteria.FindOneOptions;
  }): Promise<PersonaPrompts | null> {
    const { uniqueCriteria, options } = props;
    const typeormOptions = options ? RepositoryPersonaPromptCriteriaMapper.toFindOneOptions(options) : undefined;
    if (uniqueCriteria.type === "personaPrompt") {
      return this.personaPromptsRepository.findByPersonaPromptId(uniqueCriteria.id, typeormOptions);
    }
    if (uniqueCriteria.type === "versionAndCounselor") {
      return this.personaPromptsRepository.findByVersionAndCounselor(
        uniqueCriteria.promptVersionId,
        uniqueCriteria.counselorId,
        typeormOptions,
      );
    }
    return null;
  }

  override async findMany(props: PersonaPromptsCriteria.FindManyOptions): Promise<PersonaPrompts[]> {
    const typeormOptions = RepositoryPersonaPromptCriteriaMapper.toFindManyOptions(props);
    return this.personaPromptsRepository.findMany(typeormOptions);
  }
}
