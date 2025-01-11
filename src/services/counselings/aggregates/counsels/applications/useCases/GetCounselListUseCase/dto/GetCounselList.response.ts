import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

export interface GetCounselListUseCaseResponse extends UseCaseCoreResponse {
  counselList?: Counsels[];
}
