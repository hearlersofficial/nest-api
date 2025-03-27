import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export type CounselTechniquesCriteriaFindMany = {
  name?: string;
  toneId?: UniqueEntityId;
  ids?: UniqueEntityId[];
};
