import { PersonaPrompts } from "~counselings/domains/persona-prompts/models/persona-prompts";

import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { Dayjs } from "dayjs";

export class PersonaPromptInfo {
  constructor(
    public readonly id: PersonaPromptId,
    public readonly promptVersionId: PromptVersionId,
    public readonly counselorId: CounselorId,
    public readonly body: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(personaPrompt: PersonaPrompts): PersonaPromptInfo {
    return new PersonaPromptInfo(
      personaPrompt.id,
      personaPrompt.promptVersionId,
      personaPrompt.counselorId,
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
