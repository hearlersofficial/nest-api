import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class UserTrackingId extends UniqueEntityId {
  private readonly __brand = "UserTrackingId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
