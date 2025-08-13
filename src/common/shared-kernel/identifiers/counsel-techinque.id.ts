import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselTechniqueId extends UniqueEntityId {
  private readonly __brand = "CounselTechniqueId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
