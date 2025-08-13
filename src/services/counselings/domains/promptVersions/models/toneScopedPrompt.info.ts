import { ToneScopedPrompts } from "~counselings/domains/promptVersions/models/toneScopedPrompts";

import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { ToneScopedPromptId } from "~common/shared-kernel/identifiers/tone-scoped-prompt.id";
import { Dayjs } from "dayjs";

export class ToneScopedPromptInfo {
  constructor(
    public readonly id: ToneScopedPromptId,
    public readonly promptVersionId: PromptVersionId,
    public readonly toneId: ToneId,
    public readonly tonePromptId: TonePromptId | null,
    public readonly firstCounselTechniqueId: CounselTechniqueId | null,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(toneScopedPrompt: ToneScopedPrompts): ToneScopedPromptInfo {
    return new ToneScopedPromptInfo(
      toneScopedPrompt.id,
      toneScopedPrompt.promptVersionId,
      toneScopedPrompt.toneId,
      toneScopedPrompt.tonePromptId,
      toneScopedPrompt.firstCounselTechniqueId,
      toneScopedPrompt.createdAt,
      toneScopedPrompt.updatedAt,
      toneScopedPrompt.deletedAt,
    );
  }

  static fromDomainArray(toneScopedPrompts: ToneScopedPrompts[]): ToneScopedPromptInfo[] {
    return toneScopedPrompts.map((prompt) => ToneScopedPromptInfo.fromDomain(prompt));
  }
}
