import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { EpisodeId } from "~common/shared-kernel/identifiers/episode.id";
import { EpisodeCutSceneId } from "~common/shared-kernel/identifiers/episode-cut-scene.id";

export class CreateEpisodeCommand {
  counselorId: CounselorId;
  title: string;
  requiredRapportThreshold: number;
  isTemporary: boolean;
  cutScenes: SaveEpisodeCutSceneCommand[];
}

export class UpdateEpisodeCommand {
  episodeId: EpisodeId;
  title: string;
  requiredRapportThreshold: number;
  isTemporary: boolean;
  cutScenes: SaveEpisodeCutSceneCommand[];
}

export class SaveEpisodeCutSceneCommand {
  id?: EpisodeCutSceneId;
  speaker: Speaker;
  content: string;
  orderIndex: number;
  image: string;
}
