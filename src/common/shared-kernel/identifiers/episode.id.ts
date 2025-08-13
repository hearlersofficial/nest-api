import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class EpisodeId extends UniqueEntityId {
  private readonly __brand = "EpisodeId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
