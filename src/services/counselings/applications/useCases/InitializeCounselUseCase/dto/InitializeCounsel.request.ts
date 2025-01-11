import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

export interface InitializeCounselUseCaseRequest {
  userId: number;
  counselor: Counselors;
}
