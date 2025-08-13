import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselorId extends UniqueEntityId {
  private readonly __brand = "CounselorId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
