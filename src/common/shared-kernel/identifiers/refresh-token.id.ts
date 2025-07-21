import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class RefreshTokenId extends UniqueEntityId {
  private readonly __brand = "RefreshTokenId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
