import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/prompt-versions.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({
  name: "tone_prompts",
  comment: "톤 프롬프트",
})
export class TonePromptEntity extends CoreEntity {
  @Column({
    type: "text",
    name: "body",
    comment: "본문",
  })
  body: string;

  @ManyToOne(() => ToneEntity, (tone) => tone.tonePrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "tone_id" })
  tone: ToneEntity;

  @RelationId((tonePrompt: TonePromptEntity) => tonePrompt.tone)
  @Column({ type: "bigint", name: "tone_id" })
  toneId: string;

  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.tonePrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((tonePrompt: TonePromptEntity) => tonePrompt.promptVersion)
  @Column({ type: "bigint", name: "prompt_version_id" })
  promptVersionId: string;
}
