import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { PersonaPrompts, PersonaPromptsNewProps } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsCriteriaFindMany } from "~counselings/domains/personaPrompts/personaPrompts.criteria";
import { PersonaPromptsPersister } from "~counselings/domains/personaPrompts/personaPrompts.persister";
import { PersonaPromptsReader } from "~counselings/domains/personaPrompts/personaPrompts.reader";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class PersonaPromptsService {
  constructor(
    private readonly personaPromptsReader: PersonaPromptsReader,
    private readonly personaPromptsPersister: PersonaPromptsPersister,
  ) {}

  async create(newProps: PersonaPromptsNewProps): Promise<PersonaPrompts> {
    return this.personaPromptsPersister.create(newProps);
  }

  async update(personaPrompt: PersonaPrompts): Promise<PersonaPrompts> {
    return this.personaPromptsPersister.update(personaPrompt);
  }

  async findOne(props: { personaPromptId: UniqueEntityId }): Promise<PersonaPrompts | null> {
    return this.personaPromptsReader.findOne(props);
  }

  async getOne(props: { personaPromptId: UniqueEntityId }): Promise<PersonaPrompts> {
    const personaPrompt = await this.findOne(props);
    if (!personaPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PersonaPrompt not found");
    }
    return personaPrompt;
  }

  async findMany(props: PersonaPromptsCriteriaFindMany): Promise<PersonaPrompts[]> {
    return this.personaPromptsReader.findMany(props);
  }
}
