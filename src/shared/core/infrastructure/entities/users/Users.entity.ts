import { CoreStatus } from "~shared/core/constants/status.constants";
import { AuthUsersEntity } from "~shared/core/infrastructure/entities/AuthUsers.entity";
import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { UserActivitiesEntity } from "~shared/core/infrastructure/entities/UserActivities.entity";
import { UserMessageTokensEntity } from "~shared/core/infrastructure/entities/UserMessageTokens.entity";
import { UserProfilesEntity } from "~shared/core/infrastructure/entities/UserProfiles.entity";
import { UserProgressesEntity } from "~shared/core/infrastructure/entities/UserProgresses.entity";
import { UserPromptsEntity } from "~shared/core/infrastructure/entities/UserPrompts.entity";

<<<<<<< HEAD:src/shared/core/infrastructure/entities/Users.entity.ts
import { Column, Entity, OneToMany, OneToOne, RelationId } from "typeorm";
=======
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { UserActivitiesEntity } from "~/src/shared/core/infrastructure/entities/users/UserActivities.entity";
import { UserProfilesEntity } from "~/src/shared/core/infrastructure/entities/users/UserProfiles.entity";
import { UserProgressesEntity } from "~/src/shared/core/infrastructure/entities/users/UserProgresses.entity";
import { UserPromptsEntity } from "~/src/shared/core/infrastructure/entities/users/UserPrompts.entity";
import { AuthUsersEntity } from "~/src/shared/core/infrastructure/entities/users/AuthUsers.entity";
import { CoreStatus } from "~/src/shared/core/constants/status.constants";
import { UserMessageTokensEntity } from "~/src/shared/core/infrastructure/entities/users/UserMessageTokens.entity";
import { CounselsEntity } from "~/src/shared/core/infrastructure/entities/Counsels.entity";
import { CounselorUserRelationshipsEntity } from "~/src/shared/core/infrastructure/entities/CounselorUserRelationships.entity";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/shared/core/infrastructure/entities/users/Users.entity.ts

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
    type: "bigint",
    name: "user_profiles_id",
    comment: "사용자 프로필 ID",
    nullable: true,
  })
  userProfilesId: string;

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
