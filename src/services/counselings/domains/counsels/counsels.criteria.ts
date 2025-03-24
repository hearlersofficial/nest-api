import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export type CounselsCriteriaFindMany = {
  userId: UniqueEntityId;
  counselorId?: UniqueEntityId;
};
