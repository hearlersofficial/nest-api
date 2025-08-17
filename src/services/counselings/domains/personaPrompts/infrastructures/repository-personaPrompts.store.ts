import { PersonaPromptsRepository } from "~counselings/domains/personaPrompts/infrastructures/personaPrompts.repository";
import { PersonaPrompts, PersonaPromptsNewProps } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsStore } from "~counselings/domains/personaPrompts/personaPrompts.store";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryPersonaPromptsStore extends PersonaPromptsStore {
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
