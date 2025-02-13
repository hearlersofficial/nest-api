import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

export interface InitializeCounselWithBubbleUseCaseRequest {
  userId: UniqueEntityId;
  counselor: Counselors;
  introMessage: string;
  responseMessage: string;
}
