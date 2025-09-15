import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import { CounselCompressConditionsEntity } from "~common/system/persistences/entities/counsels/counsel-compress-conditions.entity";
import { CounselContextsEntity } from "~common/system/persistences/entities/counsels/counsel-contexts.entity";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/counsel-messages.entity";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/prompt-versions.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, RelationId } from "typeorm";

@Entity({
  name: "counsels",
  comment: "상담",
})
export class CounselsEntity extends CoreEntity {
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

  @Column({
    type: "int",
    name: "message_count",
    default: 0,
    comment: "메시지 수",
  })
  messageCount: number;

  @ManyToOne(() => UsersEntity, (user) => user.counsels, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @RelationId((counsels: CounselsEntity) => counsels.user)
  @Column({
    type: "bigint",
    name: "user_id",
    comment: "사용자 ID",
  })
  userId: string;

  @ManyToOne(() => CounselorEntity, (counselor) => counselor.counsels, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorEntity;

  @RelationId((counsels: CounselsEntity) => counsels.counselor)
  @Column({
    type: "bigint",
    name: "counselor_id",
    comment: "상담사 ID",
  })
  counselorId: string;

  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.counsels, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((counsels: CounselsEntity) => counsels.promptVersion)
  @Column({
    type: "bigint",
    name: "prompt_version_id",
    comment: "프롬프트 버전 ID",
  })
  promptVersionId: string;

  // @ManyToOne(() => CounselorUserRelationshipsEntity, (counselorUserRelationship) => counselorUserRelationship.counsels)
  // @JoinColumn({ name: "counselor_user_relationship_id" })
  // counselorUserRelationship: CounselorUserRelationshipsEntity;

  // @RelationId((counsels: CounselsEntity) => counsels.counselorUserRelationship)
  @Column({ type: "bigint", name: "counselor_user_relationship_id" })
  counselorUserRelationshipId: string;

  @OneToMany(() => CounselMessagesEntity, (counselMessage) => counselMessage.counsel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  counselMessages: CounselMessagesEntity[];

  @OneToOne(() => CounselContextsEntity, (counselContext) => counselContext.counsel, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  counselContext: CounselContextsEntity;

  @OneToOne(() => CounselCompressConditionsEntity, (compressCondition) => compressCondition.counsel, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  compressCondition: CounselCompressConditionsEntity;
}
