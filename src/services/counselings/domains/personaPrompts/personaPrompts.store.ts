import { PersonaPrompts, PersonaPromptsNewProps } from "~counselings/domains/personaPrompts/models/personaPrompts";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PersonaPromptsStore {
  abstract create(newProps: PersonaPromptsNewProps): Promise<PersonaPrompts>;
  abstract update(personaPrompt: PersonaPrompts): Promise<PersonaPrompts>;
  abstract updateMany(personaPrompts: PersonaPrompts[]): Promise<PersonaPrompts[]>;
}
