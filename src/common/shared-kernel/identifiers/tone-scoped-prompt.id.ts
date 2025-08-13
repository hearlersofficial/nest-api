import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class ToneScopedPromptId extends UniqueEntityId {
  private readonly __brand = "ToneScopedPromptId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
