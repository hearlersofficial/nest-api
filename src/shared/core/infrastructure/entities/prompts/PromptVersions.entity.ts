import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { CounselorScopedPromptEntity } from "~shared/core/infrastructure/entities/prompts/CounselorScopedPrompts.entity";
import { PromptActivateHistoryEntity } from "~shared/core/infrastructure/entities/prompts/PromptActivateHistory.entity";
import { ToneScopedPromptEntity } from "~shared/core/infrastructure/entities/prompts/ToneScopedPrompts.entity";

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
  })
  isActive: boolean;

  @Column({
    type: "boolean",
    name: "is_temporary",
    comment: "임시 상태",
  })
  isTemporary: boolean;

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
