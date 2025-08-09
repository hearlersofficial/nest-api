import { CounselorScopedPromptInfo } from "~counselings/domains/promptVersions/models/counselorScopedPrompt.info";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { ToneScopedPromptInfo } from "~counselings/domains/promptVersions/models/toneScopedPrompt.info";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Dayjs } from "dayjs";

export class PromptVersionInfo {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly counselorScopedPrompts: CounselorScopedPromptInfo[],
    public readonly toneScopedPrompts: ToneScopedPromptInfo[],
    public readonly isActive: boolean,
    public readonly isTemporary: boolean,
    public readonly isBookmarked: boolean,
    public readonly aiModel: AiModel,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(promptVersion: PromptVersions): PromptVersionInfo {
    return new PromptVersionInfo(
      promptVersion.id.getString(),
      promptVersion.name,
      promptVersion.description,
      CounselorScopedPromptInfo.fromDomainArray(promptVersion.counselorScopedPrompts),
      ToneScopedPromptInfo.fromDomainArray(promptVersion.toneScopedPrompts),
      promptVersion.isActive,
      promptVersion.isTemporary,
      promptVersion.isBookmarked,
      promptVersion.aiModel,
      promptVersion.createdAt,
      promptVersion.updatedAt,
      promptVersion.deletedAt,
    );
  }

  static fromDomainArray(promptVersions: PromptVersions[]): PromptVersionInfo[] {
    return promptVersions.map((version) => PromptVersionInfo.fromDomain(version));
  }
}
