import { AuthUsersEntity } from "~shared/core/infrastructure/entities/AuthUsers.entity";
import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";

import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";
<<<<<<< HEAD:src/shared/core/infrastructure/entities/Kakao.entity.ts
=======
import { AuthUsersEntity } from "~/src/shared/core/infrastructure/entities/users/AuthUsers.entity";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/shared/core/infrastructure/entities/users/Kakao.entity.ts

@Entity({
  name: "kakao",
  comment: "Kakao 정보 테이블",
})
export class KakaoEntity extends CoreEntity {
  @Column({
    name: "unique_id",
    comment: "고유 아이디",
  })
  uniqueId: string;

  @RelationId((kakao: KakaoEntity) => kakao.authUser)
  @Column({
    name: "auth_user_id",
  })
  authUserId: number;

  @OneToOne(() => AuthUsersEntity)
  @JoinColumn({ name: "auth_user_id" })
  authUser: AuthUsersEntity;
}
