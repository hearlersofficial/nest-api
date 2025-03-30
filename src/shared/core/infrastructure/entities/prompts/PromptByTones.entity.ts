import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { ToneEntity } from "~shared/core/infrastructure/entities/counselors/Tones.entity";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/prompts/CounselTechniques.entity";
import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";
import { TonePromptEntity } from "~shared/core/infrastructure/entities/prompts/TonePrompts.entity";

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({ name: "prompt_by_tones", comment: "톤별 프롬프트" })
export class PromptByTonesEntity extends CoreEntity {
  @ManyToOne(() => ToneEntity, (tone) => tone.promptByTones, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "tone_id" })
  tone: ToneEntity;

  @RelationId((promptByTones: PromptByTonesEntity) => promptByTones.tone)
  @Column({
    type: "bigint",
    name: "tone_id",
    comment: "톤 ID",
  })
  toneId: string;

  @ManyToOne(() => TonePromptEntity, (tonePrompt) => tonePrompt.promptByTones, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "tone_prompt_id" })
  tonePrompt: TonePromptEntity;

  @RelationId((promptByTones: PromptByTonesEntity) => promptByTones.tonePrompt)
  @Column({
    type: "bigint",
    name: "tone_prompt_id",
    comment: "톤 프롬프트 ID",
  })
  tonePromptId: string;

  @ManyToOne(() => CounselTechniquesEntity, (counselTechnique) => counselTechnique.promptByTones, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "first_counsel_technique_id" })
  firstCounselTechnique: CounselTechniquesEntity;

  @RelationId((promptByTones: PromptByTonesEntity) => promptByTones.firstCounselTechnique)
  @Column({
    type: "bigint",
    name: "first_counsel_technique_id",
    comment: "첫 번째 상담 기법 ID",
  })
  firstCounselTechniqueId: string;

  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.promptByTones, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((promptByTones: PromptByTonesEntity) => promptByTones.promptVersion)
  @Column({ type: "bigint", name: "prompt_version_id" })
  promptVersionId: string;
}
