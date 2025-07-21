import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class UserActivityId extends UniqueEntityId {
  private readonly __brand = "UserActivityId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
