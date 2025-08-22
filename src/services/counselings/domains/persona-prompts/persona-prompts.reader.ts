import { PersonaPrompts } from "~counselings/domains/persona-prompts/models/persona-prompts";
import * as PersonaPromptsCriteria from "~counselings/domains/persona-prompts/persona-prompts.criteria";

import { Injectable } from "@nestjs/common";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";

@Injectable()
export abstract class PersonaPromptsReader {
  abstract findOne(props: { personaPromptId: PersonaPromptId }): Promise<PersonaPrompts | null>;
  abstract findMany(props: PersonaPromptsCriteria.FindManyOptions): Promise<PersonaPrompts[]>;
}
