import { CoreStatus } from "~shared/core/constants/status.constants";
import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { KakaoEntity } from "~shared/core/infrastructure/entities/Kakao.entity";
import { RefreshTokenEntity } from "~shared/core/infrastructure/entities/RefreshTokens.entity";
import { UsersEntity } from "~shared/core/infrastructure/entities/Users.entity";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { Column, Entity, JoinColumn, OneToMany, OneToOne, RelationId } from "typeorm";

@Entity({
  name: "auth_users",
  comment: "사용자 인증 정보 테이블",
})
export class AuthUsersEntity extends CoreEntity {
  @OneToOne(() => UsersEntity, (user) => user.authUser, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    orphanedRowAction: "disable",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @RelationId((authUser: AuthUsersEntity) => authUser.user)
  @Column({
    name: "user_id",
    type: "int",
    comment: "사용자 ID (외래 키)",
    nullable: true,
  })
  userId: number;

  @Column({
    type: "timestamp",
    name: "last_login_at",
    comment: "마지막 로그인 시간",
    nullable: true,
  })
  lastLoginAt: string | null;

  @OneToOne(() => KakaoEntity, (kakao) => kakao.authUser, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  kakao: KakaoEntity;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.authUser, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  refreshTokens: RefreshTokenEntity[];

  @Column({
    type: "enum",
    name: "auth_channel",
    enum: AuthChannel,
    comment: "인증 채널",
    default: AuthChannel.UNLINKED,
  })
  authChannel: AuthChannel;

  @Column({
    type: "enum",
    name: "status",
    enum: CoreStatus,
    comment: "상태",
    default: CoreStatus.ACTIVE,
  })
  status: CoreStatus;
}
