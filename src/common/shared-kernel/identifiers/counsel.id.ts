import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselId extends UniqueEntityId {
  private readonly __brand = "CounselId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
