import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export type CounselTechniquesCriteriaFindMany = {
  name?: string;
  toneId?: UniqueEntityId;
  ids?: UniqueEntityId[];
};
