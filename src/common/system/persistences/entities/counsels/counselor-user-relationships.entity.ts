import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({ name: "counselor_user_relationships", comment: "유저별로 개인화된 개별 상담사와의 관계" })
export class CounselorUserRelationshipsEntity extends CoreEntity {
  @ManyToOne(() => CounselorEntity, (counselor) => counselor.counselorUserRelationships)
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorEntity;

  @RelationId((counselorUserRelationship: CounselorUserRelationshipsEntity) => counselorUserRelationship.counselor)
  @Column({ type: "bigint", name: "counselor_id" })
  counselorId: string;

  @ManyToOne(() => UsersEntity, (user) => user.counselorUserRelationships)
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @RelationId((counselorUserRelationship: CounselorUserRelationshipsEntity) => counselorUserRelationship.user)
  @Column({ type: "bigint", name: "user_id" })
  userId: string;

  @Column({ type: "int", name: "rapport", comment: "상담사와의 관계 정도" })
  rapport: number;

  @Column({ type: "int", name: "total_user_message_count", default: 0, comment: "총 사용자 메시지 수" })
  totalUserMessageCount: number;

  @Column({
    type: "timestamp",
    name: "last_interaction_at",
    nullable: true,
    comment: "마지막 상호작용 시간",
  })
  lastInteractionAt: string | null;

  @Column({ type: "int", name: "daily_increased_rapport", default: 0, comment: "일일 증가한 친밀도" })
  dailyIncreasedRapport: number;

  @Column({
    type: "timestamp",
    name: "daily_rapport_reset_at",
    nullable: true,
    comment: "일일 친밀도 초기화 시간",
  })
  dailyRapportResetAt: string | null;
}
