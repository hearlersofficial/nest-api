import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/counsel.entity";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/persona-prompts.entity";
import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/prompt-activate-history.entity";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/tone-prompts.entity";
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

  @OneToMany(() => CounselTechniquesEntity, (counselTechnique) => counselTechnique.promptVersion, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  counselTechniques: CounselTechniquesEntity[];

  @OneToMany(() => CounselTechniqueTransitionRuleEntity, (rule) => rule.promptVersion, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  counselTechniqueTransitionRules: CounselTechniqueTransitionRuleEntity[];

  @OneToMany(() => PersonaPromptEntity, (personaPrompt) => personaPrompt.promptVersion, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  personaPrompts: PersonaPromptEntity[];

  @OneToMany(() => TonePromptEntity, (tonePrompt) => tonePrompt.promptVersion, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  tonePrompts: TonePromptEntity[];

  @OneToMany(() => CounselsEntity, (counsel) => counsel.promptVersion, {
    cascade: true,
  })
  counsels: CounselsEntity[];

  @OneToMany(() => PromptActivateHistoryEntity, (promptActivateHistory) => promptActivateHistory.promptVersion, {
    cascade: true,
  })
  promptActivateHistories: PromptActivateHistoryEntity[];
}
