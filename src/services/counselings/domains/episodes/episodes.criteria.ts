import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export class EpisodesCriteria {
  counselorId?: UniqueEntityId;
  isTemporary?: boolean;
  episodeId?: UniqueEntityId;
}

export class EpisodeCutScenesCriteria {
  episodeId?: UniqueEntityId;
}
