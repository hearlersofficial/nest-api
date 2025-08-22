import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/prompt-versions.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

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

  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.personaPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((personaPrompt: PersonaPromptEntity) => personaPrompt.promptVersion)
  @Column({ type: "bigint", name: "prompt_version_id" })
  promptVersionId: string;
}
