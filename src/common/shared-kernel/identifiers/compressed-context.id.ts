import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CompressedContextId extends UniqueEntityId {
  private readonly __brand = "CompressedContextId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
