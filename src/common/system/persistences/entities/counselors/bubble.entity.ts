import { CoreEntity } from "~common/system/persistences/entities/base-core.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({
  name: "bubbles",
  comment: "상담사 인트로 버블",
})
export class BubbleEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "question",
    comment: "질문",
  })
  question: string;

  @Column({
    type: "varchar",
    name: "response_option1",
    comment: "응답 옵션 1",
  })
  responseOption1: string;

  @Column({
    type: "varchar",
    name: "response_option2",
    comment: "응답 옵션 2",
  })
  responseOption2: string;

  @ManyToOne(() => CounselorEntity, (counselor) => counselor.bubbles)
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorEntity;

  @RelationId((bubble: BubbleEntity) => bubble.counselor)
  @Column({
    type: "bigint",
    name: "counselor_id",
    comment: "상담사 ID",
  })
  counselorId: string;
}
