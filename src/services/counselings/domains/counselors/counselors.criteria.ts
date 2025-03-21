import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export type CounselorsCriteriaFindMany = {
  name?: string;
  toneId?: UniqueEntityId;
};
