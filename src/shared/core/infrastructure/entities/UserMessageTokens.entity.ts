import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { UsersEntity } from "~shared/core/infrastructure/entities/Users.entity";
import { TokenResetInterval } from "~shared/enums/TokenResetInterval.enum";

import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";

@Entity({ name: "user_message_tokens" })
export class UserMessageTokensEntity extends CoreEntity {
  @Column({
    type: "int",
    name: "max_tokens",
    comment: "최대 토큰 수 (예: 하루 할당량)",
  })
  maxTokens: number;

  @Column({
    type: "int",
    name: "remaining_tokens",
    comment: "현재 잔여 토큰 수",
  })
  remainingTokens: number;

  @Column({
    type: "boolean",
    name: "reserved",
    comment: "논리적 락 칼럼",
  })
  reserved: boolean;

  @Column({
    type: "timestamp",
    name: "reserved_timeout",
    comment: "논리적 락 타임아웃",
    nullable: true,
  })
  reservedTimeout?: string | null;

  @Column({
    type: "enum",
    enum: TokenResetInterval,
    name: "reset_interval",
    comment: "토큰 리셋 주기",
  })
  resetInterval: TokenResetInterval;

  @Column({
    type: "timestamp",
    name: "last_reset",
    comment: "마지막 리셋 시각",
  })
  lastReset: string;

  @OneToOne(() => UsersEntity, (user) => user.userMessageTokens, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @RelationId((userMessageTokens: UserMessageTokensEntity) => userMessageTokens.user)
  @Column({
    type: "int",
    name: "user_id",
    comment: "사용자 ID",
  })
  userId: number;
}
