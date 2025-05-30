import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export type CounselsCriteriaFindMany = {
  userId: UniqueEntityId;
  counselorId?: UniqueEntityId;
};
