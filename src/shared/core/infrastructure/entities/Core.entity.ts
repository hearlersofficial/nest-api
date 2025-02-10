import { BaseEntity, Column, DeleteDateColumn, PrimaryColumn } from "typeorm";

export class CoreEntity extends BaseEntity {
  @PrimaryColumn({
    type: "bigint",
    name: "id",
    comment: "ID",
  })
  id: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    comment: "생성일시 (한국시간)",
  })
  createdAt: string;

  @Column({
    name: "updated_at",
    type: "timestamp",
    comment: "마지막 수정일시 (한국시간)",
  })
  updatedAt: string;

  // NOTE: .softDelete 호출하지 않고 직접 값 넣어주기(날짜 형식 일관성)
  @DeleteDateColumn({
    name: "deleted_at",
    type: "timestamp",
    nullable: true,
    comment: "삭제일시 (한국시간)",
  })
  deletedAt?: string | null;
}
