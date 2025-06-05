import { CounselorScopedPrompts } from "~counselings/domains/promptVersions/models/counselorScopedPrompts";

import { Dayjs } from "dayjs";

export class CounselorScopedPromptInfo {
  constructor(
    public readonly id: string,
    public readonly promptVersionId: string,
    public readonly counselorId: string,
    public readonly personaPromptId: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counselorScopedPrompt: CounselorScopedPrompts): CounselorScopedPromptInfo {
    return new CounselorScopedPromptInfo(
      counselorScopedPrompt.id.getString(),
      counselorScopedPrompt.promptVersionId.getString(),
      counselorScopedPrompt.counselorId.getString(),
      counselorScopedPrompt.personaPromptId.getString(),
      counselorScopedPrompt.createdAt,
      counselorScopedPrompt.updatedAt,
      counselorScopedPrompt.deletedAt,
    );
  }

  static fromDomainArray(counselorScopedPrompts: CounselorScopedPrompts[]): CounselorScopedPromptInfo[] {
    return counselorScopedPrompts.map((prompt) => CounselorScopedPromptInfo.fromDomain(prompt));
  }
}
