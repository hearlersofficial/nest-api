import { EpisodesReader } from "~counselings/domains/episodes/episodes.reader";
import { EpisodesService } from "~counselings/domains/episodes/episodes.service";
import { EpisodesStore } from "~counselings/domains/episodes/episodes.store";
import { EpisodesRepository } from "~counselings/domains/episodes/infrastructures/episodes.repository";
import { RepositoryEpisodesReader } from "~counselings/domains/episodes/infrastructures/repository-episodes.reader";
import { RepositoryEpisodesStore } from "~counselings/domains/episodes/infrastructures/repository-episodes.store";
import { TypeormEpisodesRepository } from "~counselings/domains/episodes/infrastructures/typeorm-episodes.repository";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EpisodeEntity } from "~common/system/persistences/entities/counselors/episode.entity";
import { EpisodeCutSceneEntity } from "~common/system/persistences/entities/counselors/episode-cut-scene.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeEntity, EpisodeCutSceneEntity])],
  controllers: [],
  providers: [
    EpisodesService,
    {
      provide: EpisodesRepository,
      useClass: TypeormEpisodesRepository,
    },
    {
      provide: EpisodesReader,
      useClass: RepositoryEpisodesReader,
    },
    {
      provide: EpisodesStore,
      useClass: RepositoryEpisodesStore,
    },
  ],
  exports: [EpisodesService],
})
export class EpisodesModule {}
