import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";

export interface GetCounselMessageUseCaseResponse extends UseCaseCoreResponse {
  counselMessage?: CounselMessages;
}
