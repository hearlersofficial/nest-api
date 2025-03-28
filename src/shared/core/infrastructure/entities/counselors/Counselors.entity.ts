import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { PersonaEntity } from "~shared/core/infrastructure/entities/counselors/Personas.entity";
import { CounselorUserRelationshipsEntity } from "~shared/core/infrastructure/entities/counsels/CounselorUserRelationships.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, RelationId } from "typeorm";

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

  @OneToOne(() => PersonaEntity, (persona) => persona.counselor, {
    cascade: true,
  })
  persona: PersonaEntity;

  @OneToMany(() => CounselsEntity, (counsel) => counsel.counselor, {
    cascade: true,
  })
  counsels: CounselsEntity[];

  @OneToMany(() => CounselorUserRelationshipsEntity, (counselorUserRelationship) => counselorUserRelationship.counselor, {
    cascade: true,
  })
  counselorUserRelationships: CounselorUserRelationshipsEntity[];
}
