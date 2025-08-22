import { PersonaPromptInfo } from "~counselings/domains/persona-prompts/models/persona-prompt.info";
import { PersonaPromptsNewProps } from "~counselings/domains/persona-prompts/models/persona-prompts";
import * as PersonaPromptsCriteria from "~counselings/domains/persona-prompts/persona-prompts.criteria";
import { PersonaPromptsReader } from "~counselings/domains/persona-prompts/persona-prompts.reader";
import { PersonaPromptsStore } from "~counselings/domains/persona-prompts/persona-prompts.store";

import { HttpStatus, Injectable } from "@nestjs/common";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PersonaPromptsService {
  constructor(
    private readonly personaPromptsReader: PersonaPromptsReader,
    private readonly personaPromptsStore: PersonaPromptsStore,
  ) {}

  @Transactional()
  async create(newProps: PersonaPromptsNewProps): Promise<PersonaPromptInfo> {
    const personaPrompt = await this.personaPromptsStore.create(newProps);
    return PersonaPromptInfo.fromDomain(personaPrompt);
  }

  @Transactional()
  async update(
    personaPromptId: PersonaPromptId,
    updateProps: Partial<Pick<PersonaPromptsNewProps, "body">>,
  ): Promise<PersonaPromptInfo> {
    const personaPrompt = await this.personaPromptsReader.findOne({
      uniqueCriteria: { type: "personaPrompt", id: personaPromptId },
    });
    if (!personaPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PersonaPrompt not found");
    }
    personaPrompt.update(updateProps);
    await this.personaPromptsStore.update(personaPrompt);
    return PersonaPromptInfo.fromDomain(personaPrompt);
  }

  async getOne(props: {
    uniqueCriteria: PersonaPromptsCriteria.UniqueKey;
    options?: PersonaPromptsCriteria.FindOneOptions;
  }): Promise<PersonaPromptInfo> {
    const personaPrompt = await this.personaPromptsReader.findOne(props);
    if (!personaPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PersonaPrompt not found");
    }
    return PersonaPromptInfo.fromDomain(personaPrompt);
  }

  async findMany(props: PersonaPromptsCriteria.FindManyOptions): Promise<PersonaPromptInfo[]> {
    const personaPrompts = await this.personaPromptsReader.findMany(props);
    return personaPrompts.map((personaPrompt) => PersonaPromptInfo.fromDomain(personaPrompt));
  }
}
