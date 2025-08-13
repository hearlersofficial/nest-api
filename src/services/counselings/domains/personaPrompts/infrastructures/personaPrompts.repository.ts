import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";

import { Injectable } from "@nestjs/common";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/PersonaPrompts.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class PersonaPromptsRepository {
  abstract findByPersonaPromptId(
    personaPromptId: PersonaPromptId,
    options?: FindOneOptions<PersonaPromptEntity>,
  ): Promise<PersonaPrompts | null>;
  abstract findMany(options?: FindManyOptions<PersonaPromptEntity>): Promise<PersonaPrompts[]>;
  abstract save(personaPrompt: PersonaPrompts): Promise<PersonaPrompts>;
  abstract save(personaPrompts: PersonaPrompts[]): Promise<PersonaPrompts[]>;
}
