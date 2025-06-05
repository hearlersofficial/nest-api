import { ToneScopedPrompts } from "~counselings/domains/promptVersions/models/toneScopedPrompts";

import { Dayjs } from "dayjs";

export class ToneScopedPromptInfo {
  constructor(
    public readonly id: string,
    public readonly promptVersionId: string,
    public readonly toneId: string,
    public readonly tonePromptId: string | null,
    public readonly firstCounselTechniqueId: string | null,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(toneScopedPrompt: ToneScopedPrompts): ToneScopedPromptInfo {
    return new ToneScopedPromptInfo(
      toneScopedPrompt.id.getString(),
      toneScopedPrompt.promptVersionId.getString(),
      toneScopedPrompt.toneId.getString(),
      toneScopedPrompt.tonePromptId ? toneScopedPrompt.tonePromptId.getString() : null,
      toneScopedPrompt.firstCounselTechniqueId ? toneScopedPrompt.firstCounselTechniqueId.getString() : null,
      toneScopedPrompt.createdAt,
      toneScopedPrompt.updatedAt,
      toneScopedPrompt.deletedAt,
    );
  }

  static fromDomainArray(toneScopedPrompts: ToneScopedPrompts[]): ToneScopedPromptInfo[] {
    return toneScopedPrompts.map((prompt) => ToneScopedPromptInfo.fromDomain(prompt));
  }
}
