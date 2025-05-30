import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";

export type CounselsCriteriaFindMany = {
  userId: UniqueEntityId;
  counselorId?: UniqueEntityId;
};
