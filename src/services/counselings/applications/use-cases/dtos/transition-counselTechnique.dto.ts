import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { UseCaseCoreResponse } from "~common/shared-kernel/interfaces/UseCase.response";

export interface TransitionCounselTechniqueRequest {
  counsel: Counsels;
}

export interface TransitionCounselTechniqueResponse extends UseCaseCoreResponse {
  counsel?: Counsels;
}
