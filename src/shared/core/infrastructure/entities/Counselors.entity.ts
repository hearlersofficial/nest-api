import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";
import { CoreEntity } from "./Core.entity";
import { CounselsEntity } from "./Counsels.entity";
import { CounselorGender, CounselorType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { ToneEntity } from "~/src/shared/core/infrastructure/entities/Tones.entity";
import { PersonasEntity } from "~/src/shared/core/infrastructure/entities/Personas.entity";
import { CounselTechniquesEntity } from "~/src/shared/core/infrastructure/entities/CounselTechniques.entity";

@Entity({
  name: "counselors",
})
export class CounselorsEntity extends CoreEntity {
  @Column({
    type: "enum",
    name: "counselor_type",
    enum: CounselorType,
    comment: "상담사 타입",
  })
  counselorType: CounselorType;

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

  @OneToMany(() => CounselsEntity, (counsel) => counsel.counselor, {
    cascade: true,
  })
  counsels: CounselsEntity[];

  @OneToMany(() => PersonasEntity, (persona) => persona.counselor, {
    cascade: true,
  })
  persona: PersonasEntity[];

  @ManyToOne(() => ToneEntity, (tone) => tone.counselor, {
    cascade: true,
  })
  @JoinColumn({ name: "tone_id" })
  tone: ToneEntity;

  @RelationId((counselor: CounselorsEntity) => counselor.tone)
  @Column({
    type: "varchar",
    name: "tone_id",
    comment: "tone id",
  })
  toneId: string;

  @OneToMany(() => CounselTechniquesEntity, (counselTechnique) => counselTechnique.counselor, {
    cascade: true,
  })
  counselTechnique: CounselTechniquesEntity[];
}
