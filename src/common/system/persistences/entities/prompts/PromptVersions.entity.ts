import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";
import { CounselorScopedPromptEntity } from "~common/system/persistences/entities/prompts/CounselorScopedPrompts.entity";
import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/PromptActivateHistory.entity";
import { ToneScopedPromptEntity } from "~common/system/persistences/entities/prompts/ToneScopedPrompts.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "prompt_versions", comment: "프롬프트 버전" })
export class PromptVersionEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "name",
    comment: "프롬프트 버전 이름",
  })
  name: string;

  @Column({
    type: "text",
    name: "description",
    comment: "프롬프트 버전 설명",
  })
  description: string;

  @Column({
    type: "boolean",
    name: "is_active",
    comment: "활성 상태",
    default: false,
  })
  isActive: boolean;

  @Column({
    type: "boolean",
    name: "is_temporary",
    comment: "임시 상태",
    default: true,
  })
  isTemporary: boolean;

  @Column({
    type: "boolean",
    name: "is_bookmarked",
    comment: "북마크 상태",
    default: false,
  })
  isBookmarked: boolean;

  @Column({
    type: "enum",
    name: "ai_model",
    comment: "AI 모델",
    enum: AiModel,
    default: AiModel.GPT_4O_MINI,
  })
  aiModel: AiModel;

  @OneToMany(() => CounselorScopedPromptEntity, (counselorScopedPrompt) => counselorScopedPrompt.promptVersion, {
    cascade: true,
  })
  counselorScopedPrompts: CounselorScopedPromptEntity[];

  @OneToMany(() => ToneScopedPromptEntity, (toneScopedPrompt) => toneScopedPrompt.promptVersion, {
    cascade: true,
  })
  toneScopedPrompts: ToneScopedPromptEntity[];

  @OneToMany(() => CounselsEntity, (counsel) => counsel.promptVersion, {
    cascade: true,
  })
  counsels: CounselsEntity[];

  @OneToMany(() => PromptActivateHistoryEntity, (promptActivateHistory) => promptActivateHistory.promptVersion, {
    cascade: true,
  })
  promptActivateHistories: PromptActivateHistoryEntity[];
}
