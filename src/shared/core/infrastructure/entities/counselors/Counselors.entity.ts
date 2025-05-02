import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { ToneEntity } from "~shared/core/infrastructure/entities/counselors/Tones.entity";
import { CounselorUserRelationshipsEntity } from "~shared/core/infrastructure/entities/counsels/CounselorUserRelationships.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { CounselorScopedPromptEntity } from "~shared/core/infrastructure/entities/prompts/CounselorScopedPrompts.entity";
import { PersonaPromptEntity } from "~shared/core/infrastructure/entities/prompts/PersonaPrompts.entity";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

@Entity({
  name: "counselors",
})
export class CounselorsEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "name",
    comment: "상담사 이름",
  })
  name: string;

  @Column({
    type: "enum",
    name: "gender",
    enum: CounselorGender,
    comment: "성별",
  })
  gender: CounselorGender;

  @Column({
    type: "varchar",
    name: "description",
    comment: "상담사 소개",
  })
  description: string;

  @ManyToOne(() => ToneEntity, (tone) => tone.counselors)
  @JoinColumn({ name: "tone_id" })
  tone: ToneEntity;

  @RelationId((counselor: CounselorsEntity) => counselor.tone)
  @Column({
    type: "bigint",
    name: "tone_id",
    comment: "톤 ID",
  })
  toneId: string;

  @OneToMany(() => PersonaPromptEntity, (personaPrompt) => personaPrompt.counselor, {
    cascade: true,
  })
  personaPrompts: PersonaPromptEntity[];

  @OneToMany(() => CounselorScopedPromptEntity, (counselorScopedPrompt) => counselorScopedPrompt.counselor, {
    cascade: true,
  })
  counselorScopedPrompts: CounselorScopedPromptEntity[];

  @OneToMany(() => CounselsEntity, (counsel) => counsel.counselor, {
    cascade: true,
  })
  counsels: CounselsEntity[];

  @OneToMany(() => CounselorUserRelationshipsEntity, (counselorUserRelationship) => counselorUserRelationship.counselor, {
    cascade: true,
  })
  counselorUserRelationships: CounselorUserRelationshipsEntity[];
}
