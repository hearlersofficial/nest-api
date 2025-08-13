import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselMessageId extends UniqueEntityId {
  private readonly __brand = "CounselMessageId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
