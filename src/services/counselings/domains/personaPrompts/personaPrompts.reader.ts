import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsCriteriaFindMany } from "~counselings/domains/personaPrompts/personaPrompts.criteria";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PersonaPromptsReader {
  abstract findOne(props: { personaPromptId: UniqueEntityId }): Promise<PersonaPrompts | null>;
  abstract findMany(props: PersonaPromptsCriteriaFindMany): Promise<PersonaPrompts[]>;
}
