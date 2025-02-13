import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
export interface InitializeCounselUseCaseRequest {
  userId: UniqueEntityId;
  counselor: Counselors;
}
