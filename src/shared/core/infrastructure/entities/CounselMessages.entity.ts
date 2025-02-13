import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/Counsels.entity";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({
  name: "counsel_messages",
})
export class CounselMessagesEntity extends CoreEntity {
  @ManyToOne(() => CounselsEntity, (counsel) => counsel.counselMessages, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counsel_id" })
  counsel: CounselsEntity;

  @RelationId((counselMessages: CounselMessagesEntity) => counselMessages.counsel)
  @Column({
    type: "bigint",
    name: "counsel_id",
    comment: "상담 ID",
  })
  counselId: string;

  @Column({
    type: "bigint",
    name: "user_id",
    comment: "사용자 ID",
  })
  userId: string;

  @Column({
    type: "varchar",
    name: "message",
    comment: "메시지 내용",
  })
  message: string;

  @Column({
    type: "boolean",
    name: "is_user_message",
    comment: "사용자의 메시지인지 여부",
    default: true,
  })
  isUserMessage: boolean;

  @Column({
    name: "reacted_at",
    type: "timestamp",
    comment: "좋아요/싫어요 누른 일시 (한국시간)",
    nullable: true,
  })
  reactedAt: string;

  @Column({
    type: "enum",
    name: "reaction",
    enum: CounselMessageReaction,
    comment: "좋아요/싫어요 여부",
    nullable: true,
  })
  reaction: CounselMessageReaction;
}
