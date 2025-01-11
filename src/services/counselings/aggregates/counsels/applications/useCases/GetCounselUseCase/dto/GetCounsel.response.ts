import { UseCaseCoreResponse } from "~/src/shared/core/applications/UseCase.response";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

export interface GetCounselUseCaseResponse extends UseCaseCoreResponse {
  counsel?: Counsels;
}
