import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { EpisodeEntity } from "~common/system/persistences/entities/counselors/episode.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({
  name: "episode_cut_scenes",
  comment: "에피소드 컷씬",
})
export class EpisodeCutSceneEntity extends CoreEntity {
  @Column({
    type: "enum",
    name: "speaker",
    enum: Speaker,
    comment: "화자",
  })
  speaker: Speaker;

  @Column({
    type: "varchar",
    name: "content",
    comment: "내용",
  })
  content: string;

  @Column({
    type: "int",
    name: "order_index",
    comment: "순서 인덱스",
  })
  orderIndex: number;

  @Column({
    type: "varchar",
    name: "image",
    comment: "이미지 URL",
  })
  image: string;

  @ManyToOne(() => EpisodeEntity, (episode) => episode.cutScenes)
  @JoinColumn({ name: "episode_id" })
  episode: EpisodeEntity;

  @RelationId((cutScene: EpisodeCutSceneEntity) => cutScene.episode)
  @Column({
    type: "bigint",
    name: "episode_id",
    comment: "에피소드 ID",
  })
  episodeId: string;
}
