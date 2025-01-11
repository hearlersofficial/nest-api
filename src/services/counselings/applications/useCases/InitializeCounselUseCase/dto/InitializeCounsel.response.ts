import { UseCaseCoreResponse } from "~/src/shared/core/applications/UseCase.response";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

export interface InitializeCounselUseCaseResponse extends UseCaseCoreResponse {
  counsel?: Counsels;
  counselMessages?: CounselMessages[];
}
