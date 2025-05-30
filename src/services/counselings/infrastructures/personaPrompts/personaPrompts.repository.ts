import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PersonaPromptEntity } from "~shared/core/infrastructure/entities/prompts/PersonaPrompts.entity";
import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class PersonaPromptsRepository {
  abstract findByPersonaPromptId(
    personaPromptId: UniqueEntityId,
    options?: FindOneOptions<PersonaPromptEntity>,
  ): Promise<PersonaPrompts | null>;
  abstract findMany(options?: FindManyOptions<PersonaPromptEntity>): Promise<PersonaPrompts[]>;
  abstract save(personaPrompt: PersonaPrompts): Promise<PersonaPrompts>;
  abstract save(personaPrompts: PersonaPrompts[]): Promise<PersonaPrompts[]>;
}
