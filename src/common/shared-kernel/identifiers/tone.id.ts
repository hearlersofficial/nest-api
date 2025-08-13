import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class ToneId extends UniqueEntityId {
  private readonly __brand = "ToneId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
