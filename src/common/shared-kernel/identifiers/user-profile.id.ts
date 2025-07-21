import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class UserProfileId extends UniqueEntityId {
  private readonly __brand = "UserProfileId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
