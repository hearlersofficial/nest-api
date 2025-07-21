import { AuthChannel, Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { CoreStatus } from "~common/shared/enums/status";
import { CoreEntity } from "~common/system/persistences/entities/base-core.entity";
import { KakaoEntity } from "~common/system/persistences/entities/users/kakao-provider.entity";
import { RefreshTokenEntity } from "~common/system/persistences/entities/users/refresh-tokens.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/user.entity";
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
    type: "bigint",
    comment: "사용자 ID (외래 키)",
    nullable: true,
  })
  userId: string | null;

  @Column({
    type: "timestamp",
    name: "last_login_at",
    comment: "마지막 로그인 시간",
  })
  lastLoginAt: string;

  @OneToOne(() => KakaoEntity, (kakao) => kakao.authUser, {
    cascade: true,
    orphanedRowAction: "disable",
    nullable: true,
  })
  kakao: KakaoEntity | null;

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
    name: "authority",
    enum: Authority,
    comment: "권한",
    default: Authority.USER,
  })
  authority: Authority;

  @Column({
    type: "enum",
    name: "status",
    enum: CoreStatus,
    comment: "상태",
    default: CoreStatus.ACTIVE,
  })
  status: CoreStatus;
}
