import { EpisodesStore } from "~counselings/domains/episodes/episodes.store";
import { EpisodesRepository } from "~counselings/domains/episodes/infrastructures/episodes.repository";
import { Episodes, EpisodesNewProps } from "~counselings/domains/episodes/models/episodes";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryEpisodesStore extends EpisodesStore {
  constructor(private readonly episodesRepository: EpisodesRepository) {
    super();
  }

  override async create(newProps: EpisodesNewProps): Promise<Episodes> {
    const episode = Episodes.createNew(newProps);
    if (episode.isFailureResult()) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, episode.error);
    }
    return this.episodesRepository.save(episode.value);
  }

  override async update(episode: Episodes): Promise<Episodes> {
    return this.episodesRepository.save(episode);
  }

  override async updateMany(episodes: Episodes[]): Promise<Episodes[]> {
    return this.episodesRepository.save(episodes);
  }
}
