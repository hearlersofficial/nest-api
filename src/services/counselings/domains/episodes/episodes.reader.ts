import { Episodes } from "~counselings/domains/episodes/models/episodes";

import { Injectable } from "@nestjs/common";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { EpisodeId } from "~common/shared-kernel/identifiers/episode.id";

@Injectable()
export abstract class EpisodesReader {
  abstract findEpisodeById(episodeId: EpisodeId, withTemporary: boolean): Promise<Episodes | null>;
  abstract getEpisodeById(episodeId: EpisodeId, withTemporary: boolean): Promise<Episodes>;
  abstract findEpisodesByCounselorId(counselorId: CounselorId, withTemporary: boolean): Promise<Episodes[]>;
}
