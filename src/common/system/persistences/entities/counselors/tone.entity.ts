import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/TonePrompts.entity";
import { ToneScopedPromptEntity } from "~common/system/persistences/entities/prompts/ToneScopedPrompts.entity";
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
