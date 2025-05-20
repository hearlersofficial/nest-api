import { EpisodeEntity } from "~shared/core/infrastructure/entities/counselors/episode.entity";
import { EpisodeCutSceneEntity } from "~shared/core/infrastructure/entities/counselors/episode-cut-scene.entity";
import { EpisodesReader } from "~counselings/domains/episodes/episodes.reader";
import { EpisodesService } from "~counselings/domains/episodes/episodes.service";
import { EpisodesStore } from "~counselings/domains/episodes/episodes.store";
import { EpisodesRepository } from "~counselings/infrastructures/episodes/episodes.repository";
import { RepositoryEpisodesReader } from "~counselings/infrastructures/episodes/repository-episodes.reader";
import { RepositoryEpisodesStore } from "~counselings/infrastructures/episodes/repository-episodes.store";
import { TypeormEpisodesRepository } from "~counselings/infrastructures/episodes/typeorm-episodes.repository";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

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
