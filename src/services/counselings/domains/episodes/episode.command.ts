import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

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
  id?: UniqueEntityId;
  speaker: Speaker;
  content: string;
  orderIndex: number;
  image: string;
}
