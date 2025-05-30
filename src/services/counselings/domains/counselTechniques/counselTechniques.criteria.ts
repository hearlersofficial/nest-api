import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";

export type CounselTechniquesCriteriaFindMany = {
  name?: string;
  toneId?: UniqueEntityId;
  ids?: UniqueEntityId[];
};
