import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/counsels/CounselMessages.entity";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/counsels/Counselors.entity";
import { CounselorUserRelationshipsEntity } from "~shared/core/infrastructure/entities/counsels/CounselorUserRelationships.entity";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/counsels/CounselTechniques.entity";
import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";

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

  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.counsels, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorsEntity;

  @RelationId((counsels: CounselsEntity) => counsels.counselor)
  @Column({
    type: "bigint",
    name: "counselor_id",
    comment: "상담사 ID",
  })
  counselorId: string;

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
