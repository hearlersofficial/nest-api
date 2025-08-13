import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class PersonaPromptId extends UniqueEntityId {
  private readonly __brand = "PersonaPromptId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
