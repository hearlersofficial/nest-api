import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselorScopedPromptId extends UniqueEntityId {
  private readonly __brand = "CounselorScopedPromptId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
