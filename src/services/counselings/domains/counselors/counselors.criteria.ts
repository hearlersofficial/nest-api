import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";

export type CounselorsCriteriaFindMany = {
  name?: string;
  toneId?: UniqueEntityId;
};

export type FindManyBubblesCriteria = {
  counselorId: UniqueEntityId;
};
