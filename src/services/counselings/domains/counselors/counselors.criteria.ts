import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export type CounselorsCriteriaFindMany = {
  name?: string;
  toneId?: UniqueEntityId;
};

export type FindManyBubblesCriteria = {
  counselorId: UniqueEntityId;
};
