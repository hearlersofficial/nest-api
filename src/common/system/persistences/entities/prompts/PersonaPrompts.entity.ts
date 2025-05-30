import { CoreEntity } from "~common/system/persistences/entities/base-core.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import { CounselorScopedPromptEntity } from "~common/system/persistences/entities/prompts/CounselorScopedPrompts.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

@Entity({
  name: "persona_prompts",
  comment: "페르소나 프롬프트",
})
export class PersonaPromptEntity extends CoreEntity {
  @Column({
    type: "text",
    name: "body",
    comment: "본문",
  })
  body: string;

  @ManyToOne(() => CounselorEntity, (counselor) => counselor.personaPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorEntity;

  @RelationId((personaPrompt: PersonaPromptEntity) => personaPrompt.counselor)
  @Column({ type: "bigint", name: "counselor_id" })
  counselorId: string;

  @OneToMany(() => CounselorScopedPromptEntity, (counselorScopedPrompt) => counselorScopedPrompt.personaPrompt, {
    cascade: true,
  })
  counselorScopedPrompts: CounselorScopedPromptEntity[];
}
