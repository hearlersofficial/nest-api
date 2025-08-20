import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/TonePrompts.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({ name: "tone_scoped_prompts", comment: "톤별 프롬프트" })
export class ToneScopedPromptEntity extends CoreEntity {
  @ManyToOne(() => ToneEntity, (tone) => tone.toneScopedPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "tone_id" })
  tone: ToneEntity;

  @RelationId((toneScopedPrompt: ToneScopedPromptEntity) => toneScopedPrompt.tone)
  @Column({
    type: "bigint",
    name: "tone_id",
    comment: "톤 ID",
  })
  toneId: string;

  @ManyToOne(() => TonePromptEntity, (tonePrompt) => tonePrompt.toneScopedPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "tone_prompt_id" })
  tonePrompt: TonePromptEntity | null;

  @RelationId((toneScopedPrompt: ToneScopedPromptEntity) => toneScopedPrompt.tonePrompt)
  @Column({
    type: "bigint",
    name: "tone_prompt_id",
    comment: "톤 프롬프트 ID",
    nullable: true,
  })
  tonePromptId: string | null;

  @ManyToOne(() => CounselTechniquesEntity, (counselTechnique) => counselTechnique.toneScopedPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "first_counsel_technique_id" })
  firstCounselTechnique: CounselTechniquesEntity | null;

  @RelationId((toneScopedPrompt: ToneScopedPromptEntity) => toneScopedPrompt.firstCounselTechnique)
  @Column({
    type: "bigint",
    name: "first_counsel_technique_id",
    comment: "첫 번째 상담 기법 ID",
    nullable: true,
  })
  firstCounselTechniqueId: string | null;

  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.toneScopedPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((toneScopedPrompt: ToneScopedPromptEntity) => toneScopedPrompt.promptVersion)
  @Column({ type: "bigint", name: "prompt_version_id" })
  promptVersionId: string;
}
