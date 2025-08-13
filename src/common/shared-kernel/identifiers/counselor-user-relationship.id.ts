import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselorUserRelationshipId extends UniqueEntityId {
  private readonly __brand = "CounselorUserRelationshipId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
