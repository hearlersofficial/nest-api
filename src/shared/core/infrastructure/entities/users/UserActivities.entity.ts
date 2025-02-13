<<<<<<< HEAD:src/shared/core/infrastructure/entities/UserActivities.entity.ts
import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { UsersEntity } from "~shared/core/infrastructure/entities/Users.entity";
import { ActivityType, DevicePlatform } from "~proto/com/hearlers/v1/model/user_pb";

import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from "typeorm";
=======
import { Column, Entity, ManyToOne, JoinColumn, Index, RelationId } from "typeorm";
import { CoreEntity } from "../Core.entity";
import { UsersEntity } from "./Users.entity";
import { ActivityType, DevicePlatform } from "~/src/gen/com/hearlers/v1/model/user_pb";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/shared/core/infrastructure/entities/users/UserActivities.entity.ts

@Entity({ name: "user_activities" })
@Index(["userId", "createdAt"]) // 사용자별 활동 시간순 조회를 위한 인덱스
export class UserActivitiesEntity extends CoreEntity {
  @RelationId((userActivities: UserActivitiesEntity) => userActivities.user)
  @Column({ type: "bigint", name: "user_id" })
  userId: string;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @Column({
    type: "enum",
    name: "activity_type",
    enum: ActivityType,
    comment: "활동 유형",
  })
  activityType: ActivityType;

  @Column({
    type: "jsonb",
    name: "activity_data",
    nullable: true,
    comment: "활동 관련 상세 데이터",
  })
  activityData: Record<string, any>;

  @Column({
    type: "enum",
    name: "platform",
    enum: DevicePlatform,
    comment: "접속 플랫폼",
  })
  platform: DevicePlatform;

  @Column({
    type: "varchar",
    name: "ip_address",
    nullable: true,
    comment: "IP 주소",
  })
  ipAddress: string;

  @Column({
    type: "varchar",
    name: "user_agent",
    nullable: true,
    comment: "User Agent",
  })
  userAgent: string;

  @Column({
    type: "int",
    name: "duration_seconds",
    nullable: true,
    comment: "활동 지속 시간(초)",
  })
  durationSeconds: number;
}
