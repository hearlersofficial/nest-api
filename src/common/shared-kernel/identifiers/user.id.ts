import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class UserId extends UniqueEntityId {
  private readonly __brand = "UserId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
