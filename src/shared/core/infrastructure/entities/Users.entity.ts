import { CoreStatus } from "~shared/core/constants/status.constants";
import { AuthUsersEntity } from "~shared/core/infrastructure/entities/AuthUsers.entity";
import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { UserActivitiesEntity } from "~shared/core/infrastructure/entities/UserActivities.entity";
import { UserMessageTokensEntity } from "~shared/core/infrastructure/entities/UserMessageTokens.entity";
import { UserProfilesEntity } from "~shared/core/infrastructure/entities/UserProfiles.entity";
import { UserProgressesEntity } from "~shared/core/infrastructure/entities/UserProgresses.entity";
import { UserPromptsEntity } from "~shared/core/infrastructure/entities/UserPrompts.entity";

import { Column, Entity, OneToMany, OneToOne, RelationId } from "typeorm";

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
    nullable: true,
  })
  userProfiles: UserProfilesEntity;

  @RelationId((users: UsersEntity) => users.userProfiles)
  @Column({
    type: "int",
    name: "user_profiles_id",
    comment: "사용자 프로필 ID",
    nullable: true,
  })
  userProfilesId: number;

  @OneToMany(() => UserProgressesEntity, (userProgress) => userProgress.user, {
    cascade: true,
  })
  userProgresses: UserProgressesEntity[];

  @OneToMany(() => UserPromptsEntity, (userPrompt) => userPrompt.user, {
    cascade: true,
  })
  userPrompts: UserPromptsEntity[];

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

  @Column({
    type: "enum",
    name: "status",
    enum: CoreStatus,
    comment: "상태",
    default: CoreStatus.ACTIVE,
  })
  status: CoreStatus;
}
