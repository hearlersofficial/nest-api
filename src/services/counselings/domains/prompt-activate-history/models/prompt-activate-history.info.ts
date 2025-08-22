import { PromptActivateHistories } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history";

import { Dayjs } from "dayjs";

export class PromptActivateHistoryInfo {
  constructor(
    public readonly id: string,
    public readonly promptVersionId: string,
    public readonly activatedAt: Dayjs,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(history: PromptActivateHistories): PromptActivateHistoryInfo {
    return new PromptActivateHistoryInfo(
      history.id.getString(),
      history.promptVersionId.getString(),
      history.activatedAt,
      history.createdAt,
      history.updatedAt,
      history.deletedAt,
    );
  }

  static fromDomainArray(histories: PromptActivateHistories[]): PromptActivateHistoryInfo[] {
    return histories.map((history) => PromptActivateHistoryInfo.fromDomain(history));
  }
}
