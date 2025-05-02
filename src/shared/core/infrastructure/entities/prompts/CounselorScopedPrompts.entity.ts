import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/counselors/Counselors.entity";
import { PersonaPromptEntity } from "~shared/core/infrastructure/entities/prompts/PersonaPrompts.entity";
import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({ name: "counselor_scoped_prompts", comment: "상담사별 프롬프트" })
export class CounselorScopedPromptEntity extends CoreEntity {
  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.counselorScopedPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorsEntity;

  @RelationId((counselorScopedPrompt: CounselorScopedPromptEntity) => counselorScopedPrompt.counselor)
  @Column({
    type: "bigint",
    name: "counselor_id",
    comment: "상담사 ID",
  })
  counselorId: string;

  @ManyToOne(() => PersonaPromptEntity, (personaPrompt) => personaPrompt.counselorScopedPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "persona_prompt_id" })
  personaPrompt: PersonaPromptEntity;

  @RelationId((counselorScopedPrompt: CounselorScopedPromptEntity) => counselorScopedPrompt.personaPrompt)
  @Column({
    type: "bigint",
    name: "persona_prompt_id",
    comment: "페르소나 프롬프트 ID",
  })
  personaPromptId: string;

  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.counselorScopedPrompts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((counselorScopedPrompt: CounselorScopedPromptEntity) => counselorScopedPrompt.promptVersion)
  @Column({ type: "bigint", name: "prompt_version_id" })
  promptVersionId: string;
}
