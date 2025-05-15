import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { EpisodeCutSceneEntity } from "~shared/core/infrastructure/entities/counselors/episode-cut-scene.entity";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

@Entity({
  name: "episodes",
  comment: "에피소드",
})
export class EpisodeEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "title",
    comment: "제목",
  })
  title: string;

  @Column({
    type: "int",
    name: "required_rapport_threshold",
    comment: "필요한 래포트 임계값",
  })
  requiredRapportThreshold: number;

  @Column({
    type: "boolean",
    name: "is_temporary",
    comment: "임시 여부",
  })
  isTemporary: boolean;

  @ManyToOne(() => CounselorEntity, (counselor) => counselor.episodes)
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorEntity;

  @RelationId((episode: EpisodeEntity) => episode.counselor)
  @Column({
    type: "bigint",
    name: "counselor_id",
    comment: "상담사 ID",
  })
  counselorId: string;

  @OneToMany(() => EpisodeCutSceneEntity, (cutScene) => cutScene.episode, {
    cascade: true,
  })
  cutScenes: EpisodeCutSceneEntity[];
}
