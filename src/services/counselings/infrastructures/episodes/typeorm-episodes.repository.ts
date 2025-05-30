import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { EpisodeEntity } from "~shared/core/infrastructure/entities/counselors/episode.entity";
import { Episodes } from "~counselings/domains/episodes/models/episodes";
import { EpisodesRepository } from "~counselings/infrastructures/episodes/episodes.repository";
import { PsqlEpisodesMapper } from "~counselings/infrastructures/episodes/mappers/psql.episodes.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TypeormEpisodesRepository extends EpisodesRepository {
  constructor(
    @InjectRepository(EpisodeEntity)
    private readonly episodesRepository: Repository<EpisodeEntity>,
  ) {
    super();
  }

  override async findOne(where: {
    episodeId?: UniqueEntityId;
    counselorId?: UniqueEntityId;
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

  override async findMany(where: { counselorId?: UniqueEntityId; isTemporary?: boolean }): Promise<Episodes[]> {
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
      const savedEpisodes = await this.episodesRepository.save(entities);
      return PsqlEpisodesMapper.toDomains(savedEpisodes);
    }
    const entity = PsqlEpisodesMapper.toEntity(episode);
    const savedEpisode = await this.episodesRepository.save(entity);
    return PsqlEpisodesMapper.toDomain(savedEpisode);
  }
}
