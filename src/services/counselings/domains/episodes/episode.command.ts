import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

export class CreateEpisodeCommand {
  counselorId: UniqueEntityId;
  title: string;
  requiredRapportThreshold: number;
  isTemporary: boolean;
  cutScenes: SaveEpisodeCutSceneCommand[];
}

export class UpdateEpisodeCommand {
  episodeId: UniqueEntityId;
  title: string;
  requiredRapportThreshold: number;
  isTemporary: boolean;
  cutScenes: SaveEpisodeCutSceneCommand[];
}

export class SaveEpisodeCutSceneCommand {
  speaker: Speaker;
  content: string;
  orderIndex: number;
  image: string;
}
