import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class TonePromptId extends UniqueEntityId {
  private readonly __brand = "TonePromptId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
