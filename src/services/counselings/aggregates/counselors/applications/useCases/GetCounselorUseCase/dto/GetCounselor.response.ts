import { UseCaseCoreResponse } from "~/src/shared/core/applications/UseCase.response";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

export interface GetCounselorUseCaseResponse extends UseCaseCoreResponse {
  counselor?: Counselors;
}
