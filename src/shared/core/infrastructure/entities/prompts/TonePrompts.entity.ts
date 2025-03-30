import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { ToneEntity } from "~shared/core/infrastructure/entities/counselors/Tones.entity";
import { PromptByTonesEntity } from "~shared/core/infrastructure/entities/prompts/PromptByTones.entity";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

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

  @OneToMany(() => PromptByTonesEntity, (promptByTones) => promptByTones.tonePrompt, {
    cascade: true,
  })
  promptByTones: PromptByTonesEntity[];
}
