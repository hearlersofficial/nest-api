import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/counsel.entity";
import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";

@Entity({ name: "counsel_compress_conditions", comment: "상담 압축 조건" })
export class CounselCompressConditionsEntity extends CoreEntity {
  @Column({
    type: "int",
    name: "message_count_at_last_compression",
    default: 0,
    comment: "마지막 압축 시점의 메시지 수",
  })
  messageCountAtLastCompression: number;

  @Column({
    type: "timestamp",
    name: "last_message_compressed_at",
    nullable: true,
    comment: "마지막 메시지 압축일시",
  })
  lastMessageCompressedAt: string | null;

  // 관계 (counsel_id)
  @OneToOne(() => CounselsEntity, (counsel) => counsel.compressCondition, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  @JoinColumn({ name: "counsel_id" })
  counsel!: CounselsEntity;

  @RelationId((entity: CounselCompressConditionsEntity) => entity.counsel)
  @Column({ type: "bigint", name: "counsel_id", comment: "상담 ID" })
  counselId!: string;
}
