import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { Column, Entity } from "typeorm";

@Entity({
  name: "compressed_messages",
  comment: "압축된 메시지",
})
export class CompressedMessagesEntity extends CoreEntity {
  @Column({
    type: "bigint",
    name: "counsel_id",
    comment: "상담 ID",
  })
  counselId: string;

  @Column({
    type: "text",
    name: "content",
    comment: "압축된 컨텐츠",
  })
  content: string;

  @Column({
    type: "int",
    name: "message_count_at_compression",
    comment: "압축 시 메시지 수",
  })
  messageCountAtCompression: number;
}
