import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Episodes } from "~counselings/domains/episodes/models/episodes";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class EpisodesReader {
  abstract findEpisodeById(episodeId: UniqueEntityId, withTemporary: boolean): Promise<Episodes | null>;
  abstract findEpisodesByCounselorId(counselorId: UniqueEntityId, withTemporary: boolean): Promise<Episodes[]>;
}
