import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";

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

  // @OneToMany(() => CounselsEntity, (counsel) => counsel.counselorUserRelationship)
  // counsels: CounselsEntity[];
}
