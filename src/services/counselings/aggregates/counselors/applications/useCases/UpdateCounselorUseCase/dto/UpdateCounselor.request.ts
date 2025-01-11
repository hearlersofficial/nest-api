import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

export interface UpdateCounselorUseCaseRequest {
  toUpdateCounselor: Counselors;
}
