import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/counselors/Counselors.entity";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/prompts/CounselTechniques.entity";
import { PromptByTonesEntity } from "~shared/core/infrastructure/entities/prompts/PromptByTones.entity";
import { TonePromptEntity } from "~shared/core/infrastructure/entities/prompts/TonePrompts.entity";

import { Column, Entity, OneToMany } from "typeorm";

@Entity({
  name: "tones",
  comment: "톤",
})
export class ToneEntity extends CoreEntity {
  @Column({
    name: "name",
    comment: "이름",
  })
  name: string;

  @Column({
    type: "varchar",
    name: "description",
    comment: "설명",
  })
  description: string;

  @OneToMany(() => CounselTechniquesEntity, (counselTechnique) => counselTechnique.tone, {
    cascade: true,
  })
  counselTechniques: CounselTechniquesEntity[];

  @OneToMany(() => CounselorsEntity, (counselor) => counselor.tone, {
    cascade: true,
  })
  counselors: CounselorsEntity[];

  @OneToMany(() => TonePromptEntity, (tonePrompt) => tonePrompt.tone, {
    cascade: true,
  })
  tonePrompts: TonePromptEntity[];

  @OneToMany(() => PromptByTonesEntity, (promptByTones) => promptByTones.tone, {
    cascade: true,
  })
  promptByTones: PromptByTonesEntity[];
}
