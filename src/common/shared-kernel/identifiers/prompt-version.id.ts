import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class PromptVersionId extends UniqueEntityId {
  private readonly __brand = "PromptVersionId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
