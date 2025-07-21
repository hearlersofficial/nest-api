import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";
import { ToneScopedPromptEntity } from "~common/system/persistences/entities/prompts/ToneScopedPrompts.entity";
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

  @OneToMany(() => ToneScopedPromptEntity, (toneScopedPrompt) => toneScopedPrompt.tonePrompt, {
    cascade: true,
  })
  toneScopedPrompts: ToneScopedPromptEntity[];
}
