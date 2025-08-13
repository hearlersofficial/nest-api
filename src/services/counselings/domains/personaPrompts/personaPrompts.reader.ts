import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsCriteriaFindMany } from "~counselings/domains/personaPrompts/personaPrompts.criteria";

import { Injectable } from "@nestjs/common";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";

@Injectable()
export abstract class PersonaPromptsReader {
  abstract findOne(props: { personaPromptId: PersonaPromptId }): Promise<PersonaPrompts | null>;
  abstract findMany(props: PersonaPromptsCriteriaFindMany): Promise<PersonaPrompts[]>;
}
