import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";

import { Dayjs } from "dayjs";

export class PersonaPromptInfo {
  constructor(
    public readonly id: string,
    public readonly counselorId: string,
    public readonly body: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(personaPrompt: PersonaPrompts): PersonaPromptInfo {
    return new PersonaPromptInfo(
      personaPrompt.id.getString(),
      personaPrompt.counselorId.getString(),
      personaPrompt.body,
      personaPrompt.createdAt,
      personaPrompt.updatedAt,
      personaPrompt.deletedAt,
    );
  }

  static fromDomainArray(personaPrompts: PersonaPrompts[]): PersonaPromptInfo[] {
    return personaPrompts.map((personaPrompt) => PersonaPromptInfo.fromDomain(personaPrompt));
  }
}
