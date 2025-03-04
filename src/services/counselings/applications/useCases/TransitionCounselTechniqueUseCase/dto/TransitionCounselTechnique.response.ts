import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

export interface TransitionCounselTechniqueResponse extends UseCaseCoreResponse {
  counsel?: Counsels;
}
