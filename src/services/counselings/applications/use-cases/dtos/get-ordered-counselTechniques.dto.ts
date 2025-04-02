import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

export interface GetOrderedCounselTechniquesUseCaseRequest {
  firstCounselTechniqueId: UniqueEntityId;
}

export interface GetOrderedCounselTechniquesUseCaseResponse extends UseCaseCoreResponse {
  counselTechniques: CounselTechniques[];
}
