import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/auth-users.entity";
import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";

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
    type: "bigint",
  })
  authUserId: string;

  @OneToOne(() => AuthUsersEntity)
  @JoinColumn({ name: "auth_user_id" })
  authUser: AuthUsersEntity;
}
