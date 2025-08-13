import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class EpisodeCutSceneId extends UniqueEntityId {
  private readonly __brand = "EpisodeCutSceneId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
