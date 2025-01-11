import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

export interface UpdateCounselorUseCaseResponse extends UseCaseCoreResponse {
  counselor?: Counselors;
}
