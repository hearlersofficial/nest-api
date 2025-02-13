<<<<<<< HEAD:src/shared/core/infrastructure/entities/RefreshTokens.entity.ts
import { AuthUsersEntity } from "~shared/core/infrastructure/entities/AuthUsers.entity";

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
=======
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { AuthUsersEntity } from "~/src/shared/core/infrastructure/entities/users/AuthUsers.entity";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/shared/core/infrastructure/entities/users/RefreshTokens.entity.ts
@Entity({ name: "refresh_tokens", comment: "리프레시 토큰 테이블" })
export class RefreshTokenEntity extends CoreEntity {
  @Column({ type: "varchar", comment: "리프레시 토큰" })
  token: string;

  @Column({ type: "timestamp", comment: "토큰 만료 시간" })
  expiresAt: string;

  @JoinColumn({ name: "authUserId" })
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
