import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/counselors/Counselors.entity";
import { PromptByCounselorsEntity } from "~shared/core/infrastructure/entities/prompts/PromptByCounselors.entity";

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

  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.personaPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorsEntity;

  @RelationId((personaPrompt: PersonaPromptEntity) => personaPrompt.counselor)
  @Column({ type: "bigint", name: "counselor_id" })
  counselorId: string;

  @OneToMany(() => PromptByCounselorsEntity, (promptByCounselors) => promptByCounselors.personaPrompt, {
    cascade: true,
  })
  promptByCounselors: PromptByCounselorsEntity[];
}
