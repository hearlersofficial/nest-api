import { CoreStatus } from "~/src/shared/core/constants/status.constants";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";

import { Column, Entity } from "typeorm";

@Entity({
  name: "admin_users",
  comment: "Admin 관리자 테이블",
})
export class AdminMembersEntity extends CoreEntity {
  @Column({
    type: "varchar",
    comment: "아이디",
  })
  identifier: string;

  @Column({
    type: "varchar",
    comment: "비밀번호",
  })
  password: string;

  @Column({
    type: "varchar",
    comment: "이름",
  })
  name: string;

  @Column({
    type: "enum",
    enum: CoreStatus,
    default: CoreStatus.ACTIVE,
    comment: "상태",
  })
  status: CoreStatus;
}
