import { PersonaPromptInfo } from "~counselings/domains/personaPrompts/models/personaPrompt.info";
import { PersonaPromptsNewProps } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsPersister } from "~counselings/domains/personaPrompts/personaPrompts.persister";
import { PersonaPromptsReader } from "~counselings/domains/personaPrompts/personaPrompts.reader";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PersonaPromptsService {
  constructor(
    private readonly personaPromptsReader: PersonaPromptsReader,
    private readonly personaPromptsPersister: PersonaPromptsPersister,
  ) {}

  @Transactional()
  async create(newProps: PersonaPromptsNewProps): Promise<PersonaPromptInfo> {
    const personaPrompt = await this.personaPromptsPersister.create(newProps);
    return PersonaPromptInfo.fromDomain(personaPrompt);
  }

  async getOne(props: { personaPromptId: UniqueEntityId }): Promise<PersonaPromptInfo> {
    const personaPrompt = await this.personaPromptsReader.findOne(props);
    if (!personaPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PersonaPrompt not found");
    }
    return PersonaPromptInfo.fromDomain(personaPrompt);
  }
}
