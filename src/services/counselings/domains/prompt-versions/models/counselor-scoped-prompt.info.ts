import { CounselorScopedPrompts } from "~counselings/domains/prompt-versions/models/counselor-scoped-prompts";

import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorScopedPromptId } from "~common/shared-kernel/identifiers/counselor-scoped-prompt.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { Dayjs } from "dayjs";

export class CounselorScopedPromptInfo {
  constructor(
    public readonly id: CounselorScopedPromptId,
    public readonly promptVersionId: PromptVersionId,
    public readonly counselorId: CounselorId,
    public readonly personaPromptId: PersonaPromptId,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counselorScopedPrompt: CounselorScopedPrompts): CounselorScopedPromptInfo {
    return new CounselorScopedPromptInfo(
      counselorScopedPrompt.id,
      counselorScopedPrompt.promptVersionId,
      counselorScopedPrompt.counselorId,
      counselorScopedPrompt.personaPromptId,
      counselorScopedPrompt.createdAt,
      counselorScopedPrompt.updatedAt,
      counselorScopedPrompt.deletedAt,
    );
  }

  static fromDomainArray(counselorScopedPrompts: CounselorScopedPrompts[]): CounselorScopedPromptInfo[] {
    return counselorScopedPrompts.map((prompt) => CounselorScopedPromptInfo.fromDomain(prompt));
  }
}
