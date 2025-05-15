import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/prompts/CounselTechniques.entity";
import { TonePromptEntity } from "~shared/core/infrastructure/entities/prompts/TonePrompts.entity";
import { ToneScopedPromptEntity } from "~shared/core/infrastructure/entities/prompts/ToneScopedPrompts.entity";

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

  @OneToMany(() => CounselorEntity, (counselor) => counselor.tone, {
    cascade: true,
  })
  counselors: CounselorEntity[];

  @OneToMany(() => TonePromptEntity, (tonePrompt) => tonePrompt.tone, {
    cascade: true,
  })
  tonePrompts: TonePromptEntity[];

  @OneToMany(() => ToneScopedPromptEntity, (toneScopedPrompt) => toneScopedPrompt.tone, {
    cascade: true,
  })
  toneScopedPrompts: ToneScopedPromptEntity[];
}
