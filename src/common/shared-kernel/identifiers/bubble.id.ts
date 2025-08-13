import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class BubbleId extends UniqueEntityId {
  private readonly __brand = "BubbleId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
