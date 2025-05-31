import { EpisodesReader } from "~counselings/domains/episodes/episodes.reader";
import { Episodes } from "~counselings/domains/episodes/models/episodes";
import { EpisodesRepository } from "~counselings/infrastructures/episodes/episodes.repository";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

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
}
