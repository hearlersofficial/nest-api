import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class KakaoId extends UniqueEntityId {
  private readonly __brand = "KakaoId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
