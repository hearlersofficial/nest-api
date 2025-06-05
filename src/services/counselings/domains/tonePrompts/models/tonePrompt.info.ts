import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";

import { Dayjs } from "dayjs";

export class TonePromptInfo {
  constructor(
    public readonly id: string,
    public readonly toneId: string,
    public readonly body: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(tonePrompt: TonePrompts): TonePromptInfo {
    return new TonePromptInfo(
      tonePrompt.id.getString(),
      tonePrompt.toneId.getString(),
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
