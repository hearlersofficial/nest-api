import { Episodes } from "~counselings/domains/episodes/models/episodes";

import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { EpisodeId } from "~common/shared-kernel/identifiers/episode.id";

export abstract class EpisodesRepository {
  abstract findOne(where: {
    episodeId?: EpisodeId;
    counselorId?: CounselorId;
    isTemporary?: boolean;
  }): Promise<Episodes | null>;
  abstract findMany(where: { counselorId?: CounselorId; isTemporary?: boolean }): Promise<Episodes[]>;
  abstract save(episode: Episodes): Promise<Episodes>;
  abstract save(episode: Episodes[]): Promise<Episodes[]>;
}
