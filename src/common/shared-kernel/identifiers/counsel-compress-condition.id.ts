import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselCompressConditionId extends UniqueEntityId {
  private readonly __brand = "CounselCompressConditionId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
