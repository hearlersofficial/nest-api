import { Episodes } from "~counselings/domains/episodes/models/episodes";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export abstract class EpisodesReader {
  abstract findEpisodeById(episodeId: UniqueEntityId, withTemporary: boolean): Promise<Episodes | null>;
  abstract getEpisodeById(episodeId: UniqueEntityId, withTemporary: boolean): Promise<Episodes>;
  abstract findEpisodesByCounselorId(counselorId: UniqueEntityId, withTemporary: boolean): Promise<Episodes[]>;
}
