import { PersonaPrompts, PersonaPromptsNewProps } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsPersister } from "~counselings/domains/personaPrompts/personaPrompts.persister";
import { PersonaPromptsRepository } from "~counselings/infrastructures/personaPrompts/personaPrompts.repository";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryPersonaPromptsPersister extends PersonaPromptsPersister {
  constructor(private readonly personaPromptsRepository: PersonaPromptsRepository) {
    super();
  }

  override async create(newProps: PersonaPromptsNewProps): Promise<PersonaPrompts> {
    const personaPromptResult = PersonaPrompts.createNew(newProps);
    if (personaPromptResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, personaPromptResult.error as string);
    }
    return this.personaPromptsRepository.save(personaPromptResult.value);
  }

  override async update(personaPrompt: PersonaPrompts): Promise<PersonaPrompts> {
    return this.personaPromptsRepository.save(personaPrompt);
  }

  override async updateMany(personaPrompts: PersonaPrompts[]): Promise<PersonaPrompts[]> {
    return this.personaPromptsRepository.save(personaPrompts);
  }
}
