import { CoreStatus } from "~shared/core/constants/status.constants";
import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorUserRelationshipsEntity } from "~shared/core/infrastructure/entities/CounselorUserRelationships.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/Counsels.entity";
import { AuthUsersEntity } from "~shared/core/infrastructure/entities/users/AuthUsers.entity";
import { UserActivitiesEntity } from "~shared/core/infrastructure/entities/users/UserActivities.entity";
import { UserMessageTokensEntity } from "~shared/core/infrastructure/entities/users/UserMessageTokens.entity";
import { UserProfilesEntity } from "~shared/core/infrastructure/entities/users/UserProfiles.entity";
import { UserProgressesEntity } from "~shared/core/infrastructure/entities/users/UserProgresses.entity";

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

  @OneToMany(() => UserProgressesEntity, (userProgress) => userProgress.user, {
    cascade: true,
  })
  userProgresses: UserProgressesEntity[];

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
