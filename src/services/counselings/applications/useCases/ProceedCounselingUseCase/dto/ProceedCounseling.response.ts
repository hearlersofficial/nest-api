import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

export interface ProceedCounselingResponse extends UseCaseCoreResponse {
  counsel: Counsels;
  createdCounselMessage: CounselMessages;
  counselorResponseMessage: CounselMessages;
}
