import { CounselStage } from "~/src/shared/enums/CounselStage.enum";

import { CoreEntity } from "./Core.entity";
import { CounselMessagesEntity } from "./CounselMessages.entity";
import { CounselorsEntity } from "./Counselor.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

@Entity({
  name: "counsels",
})
export class CounselsEntity extends CoreEntity {
  @Column({
    type: "int",
    name: "user_id",
    comment: "사용자 ID",
  })
  userId: number;

  @Column({
    type: "enum",
    name: "counsel_stage",
    enum: CounselStage,
    comment: "상담 단계",
    default: CounselStage.SMALL_TALK,
  })
  counselStage: CounselStage;

  @Column({
    name: "last_chated_at",
    type: "timestamp",
    nullable: true,
    comment: "마지막 채팅일시 (한국시간)",
  })
  lastChatedAt: string | null;

  @Column({
    name: "last_message",
    type: "varchar",
    nullable: true,
    comment: "마지막 메시지",
  })
  lastMessage: string | null;

  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.counsels, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorsEntity;

  @RelationId((counsels: CounselsEntity) => counsels.counselor)
  @Column({
    type: "int",
    name: "counselor_id",
    comment: "상담사 ID",
  })
  counselorId: number;

  @OneToMany(() => CounselMessagesEntity, (counselMessage) => counselMessage.counsel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  counselMessages: CounselMessagesEntity[];
}
