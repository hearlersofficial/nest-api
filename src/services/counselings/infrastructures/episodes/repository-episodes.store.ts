import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { EpisodesStore } from "~counselings/domains/episodes/episodes.store";
import {
  Episodes,
  EpisodesNewProps,
} from "~counselings/domains/episodes/models/episodes";
import { EpisodesRepository } from "~counselings/infrastructures/episodes/episodes.repository";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryEpisodesStore extends EpisodesStore {
  constructor(private readonly episodesRepository: EpisodesRepository) {
    super();
  }

  override async create(newProps: EpisodesNewProps): Promise<Episodes> {
    const episode = Episodes.createNew(newProps);
    if (episode.isFailureResult()) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.BAD_REQUEST,
        episode.error
      );
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
