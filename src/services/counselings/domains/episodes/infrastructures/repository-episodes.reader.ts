import { EpisodesReader } from "~counselings/domains/episodes/episodes.reader";
import { EpisodesRepository } from "~counselings/domains/episodes/infrastructures/episodes.repository";
import { Episodes } from "~counselings/domains/episodes/models/episodes";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryEpisodesReader extends EpisodesReader {
  constructor(private readonly episodesRepository: EpisodesRepository) {
    super();
  }

  override async findEpisodesByCounselorId(counselorId: UniqueEntityId, withTemporary: boolean): Promise<Episodes[]> {
    return this.episodesRepository.findMany({
      counselorId,
      isTemporary: withTemporary ? undefined : false,
    });
  }

  override async findEpisodeById(episodeId: UniqueEntityId, withTemporary: boolean): Promise<Episodes | null> {
    return this.episodesRepository.findOne({
      episodeId,
      isTemporary: withTemporary ? undefined : false,
    });
  }

  override async getEpisodeById(episodeId: UniqueEntityId, withTemporary: boolean): Promise<Episodes> {
    const episode = await this.episodesRepository.findOne({
      episodeId,
      isTemporary: withTemporary ? undefined : false,
    });
    if (!episode) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Episode not found");
    }
    return episode;
  }
}
