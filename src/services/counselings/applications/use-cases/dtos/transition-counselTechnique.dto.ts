import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

export interface TransitionCounselTechniqueRequest {
  counsel: Counsels;
}

export interface TransitionCounselTechniqueResponse extends UseCaseCoreResponse {
  counsel?: Counsels;
}
