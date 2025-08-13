import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselContextId extends UniqueEntityId {
  private readonly __brand = "CounselContextId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
