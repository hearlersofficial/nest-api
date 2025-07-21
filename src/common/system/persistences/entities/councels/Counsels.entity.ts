import { CoreEntity } from "~common/system/persistences/entities/base-core.entity";
import { CounselMessagesEntity } from "~common/system/persistences/entities/councels/CounselMessages.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/CounselTechniques.entity";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

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

  @Column({
    type: "int",
    name: "not_compressed_message_count",
    default: 0,
    comment: "압축되지 않은 메시지 수",
  })
  notCompressedMessageCount: number;

  @Column({
    type: "timestamp",
    name: "last_context_compressed_at",
    nullable: true,
    comment: "마지막 컨텍스트 압축일시 (한국시간)",
  })
  lastContextCompressedAt: string | null;

  @Column({
    type: "boolean",
    name: "compressed_context_exists",
    default: false,
    comment: "압축된 컨텍스트 존재 여부",
  })
  compressedContextExists: boolean;

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

  @ManyToOne(() => CounselTechniquesEntity, (counselTechnique) => counselTechnique.counsels, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counsel_technique_id" })
  counselTechnique: CounselTechniquesEntity;

  @RelationId((counsels: CounselsEntity) => counsels.counselTechnique)
  @Column({
    type: "bigint",
    name: "counsel_technique_id",
    comment: "상담 기법 ID",
  })
  counselTechniqueId: string;

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
}
