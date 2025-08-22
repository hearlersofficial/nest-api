import { PersonaPrompts } from "~counselings/domains/persona-prompts/models/persona-prompts";
import * as PersonaPromptsCriteria from "~counselings/domains/persona-prompts/persona-prompts.criteria";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PersonaPromptsReader {
  abstract findOne(props: {
    uniqueCriteria: PersonaPromptsCriteria.UniqueKey;
    options?: PersonaPromptsCriteria.FindOneOptions;
  }): Promise<PersonaPrompts | null>;
  abstract findMany(props: PersonaPromptsCriteria.FindManyOptions): Promise<PersonaPrompts[]>;
}
