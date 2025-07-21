import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class AuthUserId extends UniqueEntityId {
  private readonly __brand = "AuthUserId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
