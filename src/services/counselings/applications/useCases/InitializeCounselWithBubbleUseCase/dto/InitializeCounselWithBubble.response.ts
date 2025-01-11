import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

export interface InitializeCounselWithBubbleUseCaseResponse extends UseCaseCoreResponse {
  counsel?: Counsels;
  counselMessages?: CounselMessages[];
}
