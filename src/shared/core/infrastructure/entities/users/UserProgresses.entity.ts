import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { UsersEntity } from "~shared/core/infrastructure/entities/Users.entity";
import { ProgressStatus } from "~proto/com/hearlers/v1/model/user_pb";
import { ProgressType } from "~proto/com/hearlers/v1/model/user_pb";

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
<<<<<<< HEAD:src/shared/core/infrastructure/entities/UserProgresses.entity.ts
=======
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { UsersEntity } from "~/src/shared/core/infrastructure/entities/users/Users.entity";
import { ProgressStatus } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { ProgressType } from "~/src/gen/com/hearlers/v1/model/user_pb";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/shared/core/infrastructure/entities/users/UserProgresses.entity.ts

@Entity({ name: "user_progresses" })
export class UserProgressesEntity extends CoreEntity {
  @Column({
    type: "enum",
    name: "progress_type",
    enum: ProgressType,
    comment: "진행 상태 유형",
  })
  progressType: ProgressType;

  @Column({
    type: "enum",
    name: "status",
    enum: ProgressStatus,
    default: ProgressStatus.NOT_STARTED,
    comment: "진행 상태",
  })
  status: ProgressStatus;

  @Column({
    type: "timestamp",
    name: "last_updated",
    comment: "마지막 업데이트 시간",
  })
  lastUpdated: string;

  @ManyToOne(() => UsersEntity, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @RelationId((userProgresses: UserProgressesEntity) => userProgresses.user)
  @Column({
    type: "bigint",
    name: "user_id",
    comment: "사용자 ID",
  })
  userId: string;
}
