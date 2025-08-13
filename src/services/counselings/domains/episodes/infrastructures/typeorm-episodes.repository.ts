import { EpisodesRepository } from "~counselings/domains/episodes/infrastructures/episodes.repository";
import { PsqlEpisodesMapper } from "~counselings/domains/episodes/infrastructures/mappers/psql.episodes.mapper";
import { Episodes } from "~counselings/domains/episodes/models/episodes";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { EpisodeId } from "~common/shared-kernel/identifiers/episode.id";
import { EpisodeEntity } from "~common/system/persistences/entities/counselors/episode.entity";
import { EpisodeCutSceneEntity } from "~common/system/persistences/entities/counselors/episode-cut-scene.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class TypeormEpisodesRepository extends EpisodesRepository {
  constructor(
    @InjectRepository(EpisodeEntity)
    private readonly episodesRepository: Repository<EpisodeEntity>,
    @InjectRepository(EpisodeCutSceneEntity)
    private readonly episodeCutScenesRepository: Repository<EpisodeCutSceneEntity>,
  ) {
    super();
  }

  override async findOne(where: {
    episodeId?: EpisodeId;
    counselorId?: CounselorId;
    isTemporary?: boolean;
  }): Promise<Episodes | null> {
    const episode = await this.episodesRepository.findOne({
      where: {
        id: where.episodeId?.getString(),
        counselorId: where.counselorId?.getString(),
        isTemporary: where.isTemporary,
      },
      relations: {
        cutScenes: true,
      },
    });
    if (!episode) {
      return null;
    }

    return PsqlEpisodesMapper.toDomain(episode);
  }

  override async findMany(where: { counselorId?: CounselorId; isTemporary?: boolean }): Promise<Episodes[]> {
    const episodes = await this.episodesRepository.find({
      where: {
        counselorId: where.counselorId?.getString(),
        isTemporary: where.isTemporary,
      },
      relations: {
        cutScenes: true,
      },
    });
    return PsqlEpisodesMapper.toDomains(episodes);
  }

  override async save(episode: Episodes): Promise<Episodes>;
  override async save(episodes: Episodes[]): Promise<Episodes[]>;
  override async save(episode: Episodes | Episodes[]): Promise<Episodes | Episodes[]> {
    if (Array.isArray(episode)) {
      const entities = episode.map((e) => PsqlEpisodesMapper.toEntity(e));
      await this.episodeCutScenesRepository.softDelete({ episodeId: In(entities.map((e) => e.id)) });
      const savedEpisodes = await this.episodesRepository.save(entities);
      return PsqlEpisodesMapper.toDomains(savedEpisodes);
    }
    const entity = PsqlEpisodesMapper.toEntity(episode);
    await this.episodeCutScenesRepository.softDelete({ episodeId: entity.id });
    const savedEpisode = await this.episodesRepository.save(entity);
    return PsqlEpisodesMapper.toDomain(savedEpisode);
  }
}
