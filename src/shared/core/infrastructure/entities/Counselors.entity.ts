import { Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from "./Core.entity";
import { CounselsEntity } from "./Counsels.entity";
import { CounselorGender, CounselorType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { PersonasEntity } from "~/src/shared/core/infrastructure/entities/prompts/Personas.entity";
import { CounselorUserRelationshipsEntity } from "~/src/shared/core/infrastructure/entities/CounselorUserRelationships.entity";

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

  @OneToMany(
    () => CounselorUserRelationshipsEntity,
    (counselorUserRelationship) => counselorUserRelationship.counselor,
    {
      cascade: true,
    },
  )
  counselorUserRelationships: CounselorUserRelationshipsEntity[];
}
