import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class UserMessageTokenId extends UniqueEntityId {
  private readonly __brand = "UserMessageTokenId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
