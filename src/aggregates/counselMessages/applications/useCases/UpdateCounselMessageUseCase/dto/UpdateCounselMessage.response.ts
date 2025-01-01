import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";
import { UseCaseCoreResponse } from "~/src/shared/core/applications/UseCase.response";

export interface UpdateCounselMessageUseCaseResponse extends UseCaseCoreResponse {
  counselMessage?: CounselMessages;
}
