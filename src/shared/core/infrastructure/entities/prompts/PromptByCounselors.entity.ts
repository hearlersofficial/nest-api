import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/counselors/Counselors.entity";
import { PersonaPromptEntity } from "~shared/core/infrastructure/entities/prompts/PersonaPrompts.entity";
import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({ name: "prompt_by_counselors", comment: "상담사별 프롬프트" })
export class PromptByCounselorsEntity extends CoreEntity {
  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.promptByCounselors, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorsEntity;

  @RelationId((promptByCounselors: PromptByCounselorsEntity) => promptByCounselors.counselor)
  @Column({
    type: "bigint",
    name: "counselor_id",
    comment: "상담사 ID",
  })
  counselorId: string;

  @ManyToOne(() => PersonaPromptEntity, (personaPrompt) => personaPrompt.promptByCounselors, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "persona_prompt_id" })
  personaPrompt: PersonaPromptEntity;

  @RelationId((promptByCounselors: PromptByCounselorsEntity) => promptByCounselors.personaPrompt)
  @Column({
    type: "bigint",
    name: "persona_prompt_id",
    comment: "페르소나 프롬프트 ID",
  })
  personaPromptId: string;

  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.promptByCounselors, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((promptByCounselors: PromptByCounselorsEntity) => promptByCounselors.promptVersion)
  @Column({ type: "bigint", name: "prompt_version_id" })
  promptVersionId: string;
}
