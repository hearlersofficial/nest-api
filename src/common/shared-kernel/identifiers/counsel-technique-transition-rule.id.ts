import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export class CounselTechniqueTransitionRuleId extends UniqueEntityId {
  private readonly __brand = "CounselTechniqueTransitionRuleId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}
