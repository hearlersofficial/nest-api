import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { EpisodeEntity } from "~shared/core/infrastructure/entities/counselors/episode.entity";
import { EpisodeCutSceneEntity } from "~shared/core/infrastructure/entities/counselors/episode-cut-scene.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselorEntity, EpisodeEntity, EpisodeCutSceneEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class EpisodesModule {}
