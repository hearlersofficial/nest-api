import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/auth-users.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
@Entity({ name: "refresh_tokens", comment: "리프레시 토큰 테이블" })
export class RefreshTokenEntity extends CoreEntity {
  @Column({ type: "varchar", comment: "리프레시 토큰" })
  token: string;

  @Column({ type: "timestamp", comment: "토큰 만료 시간" })
  expiresAt: string;

  @JoinColumn({ name: "auth_user_id" })
  @ManyToOne(() => AuthUsersEntity, (authUser) => authUser.refreshTokens, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  authUser: AuthUsersEntity;

  @RelationId((refreshToken: RefreshTokenEntity) => refreshToken.authUser)
  @Column({ type: "bigint", name: "auth_user_id", comment: "사용자 ID" })
  authUserId: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    comment: "생성일시 (한국시간)",
  })
  createdAt: string;

  @Column({
    name: "updated_at",
    type: "timestamp",
    comment: "마지막 수정일시 (한국시간)",
  })
  updatedAt: string;
}
