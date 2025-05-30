import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { EpisodesReader } from "~counselings/domains/episodes/episodes.reader";
import { EpisodesStore } from "~counselings/domains/episodes/episodes.store";
import { Episodes, EpisodesNewProps } from "~counselings/domains/episodes/models/episodes";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class EpisodesService {
  constructor(
    private readonly episodesReader: EpisodesReader,
    private readonly episodesStore: EpisodesStore,
  ) {}

  @Transactional()
  async create(newProps: EpisodesNewProps): Promise<Episodes> {
    return this.episodesStore.create(newProps);
  }

  @Transactional()
  async update(episode: Episodes): Promise<Episodes> {
    return this.episodesStore.update(episode);
  }

  @Transactional()
  async updateMany(episodes: Episodes[]): Promise<Episodes[]> {
    return this.episodesStore.updateMany(episodes);
  }

  @Transactional()
  async delete(episodeId: UniqueEntityId): Promise<Episodes> {
    const episode = await this.getEpisodeById(episodeId, true);
    const result = episode.delete();
    if (result.isFailureResult()) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, result.error);
    }
    return this.episodesStore.update(episode);
  }

  async findEpisodesByCounselorId(counselorId: UniqueEntityId, withTemporary: boolean = false): Promise<Episodes[]> {
    return this.episodesReader.findEpisodesByCounselorId(counselorId, withTemporary);
  }

  async findEpisodeById(episodeId: UniqueEntityId, withTemporary: boolean = false): Promise<Episodes | null> {
    return this.episodesReader.findEpisodeById(episodeId, withTemporary);
  }

  async getEpisodeById(episodeId: UniqueEntityId, withTemporary: boolean = false): Promise<Episodes> {
    const episode = await this.episodesReader.findEpisodeById(episodeId, withTemporary);
    if (!episode) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Episode not found");
    }
    return episode;
  }
}
