import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";

import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { Dayjs } from "dayjs";

export class TonePromptInfo {
  constructor(
    public readonly id: TonePromptId,
    public readonly toneId: ToneId,
    public readonly body: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(tonePrompt: TonePrompts): TonePromptInfo {
    return new TonePromptInfo(
      tonePrompt.id,
      tonePrompt.toneId,
      tonePrompt.body,
      tonePrompt.createdAt,
      tonePrompt.updatedAt,
      tonePrompt.deletedAt,
    );
  }

  static fromDomainArray(tonePrompts: TonePrompts[]): TonePromptInfo[] {
    return tonePrompts.map((tonePrompt) => TonePromptInfo.fromDomain(tonePrompt));
  }
}
