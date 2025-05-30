import { CoreStatus } from "~common/shared/constants/status.constants";
import { CoreEntity } from "~common/system/persistences/entities/base-core.entity";
import { CounselorUserRelationshipsEntity } from "~common/system/persistences/entities/councels/CounselorUserRelationships.entity";
import { CounselsEntity } from "~common/system/persistences/entities/councels/Counsels.entity";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/AuthUsers.entity";
import { UserActivitiesEntity } from "~common/system/persistences/entities/users/UserActivities.entity";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/UserMessageTokens.entity";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/UserProfiles.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity({
  name: "users",
})
export class UsersEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "nickname",
    comment: "닉네임",
  })
  nickname: string;

  @OneToOne(() => UserProfilesEntity, (userProfiles) => userProfiles.user, {
    cascade: true,
  })
  userProfiles: UserProfilesEntity;

  @OneToMany(() => UserActivitiesEntity, (userActivity) => userActivity.user, {
    cascade: true,
  })
  userActivities: UserActivitiesEntity[];

  @OneToOne(() => AuthUsersEntity, (authUser) => authUser.user, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  authUser: AuthUsersEntity;

  @OneToOne(() => UserMessageTokensEntity, (userMessageTokens) => userMessageTokens.user, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  userMessageTokens: UserMessageTokensEntity;

  @OneToMany(() => CounselsEntity, (counsel) => counsel.user, {
    cascade: true,
  })
  counsels: CounselsEntity[];

  @OneToMany(() => CounselorUserRelationshipsEntity, (counselorUserRelationship) => counselorUserRelationship.user, {
    cascade: true,
  })
  counselorUserRelationships: CounselorUserRelationshipsEntity[];

  @Column({
    type: "enum",
    name: "status",
    enum: CoreStatus,
    comment: "상태",
    default: CoreStatus.ACTIVE,
  })
  status: CoreStatus;
}
