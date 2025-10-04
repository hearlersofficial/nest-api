import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: "user_trackings" })
export class UserTrackingsEntity extends CoreEntity {
  // 인트로 컷씬을 시청했는 지 유무
  @Column({ type: "boolean", name: "intro_cutscene_watched" })
  introCutsceneWatched: boolean;

  @Column({ type: "bigint", name: "user_id" })
  userId: string;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;
}
