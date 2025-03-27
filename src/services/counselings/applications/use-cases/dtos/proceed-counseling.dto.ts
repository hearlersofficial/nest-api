import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

export interface ProceedCounselingRequest {
  counsel: Counsels;
  userMessage: string;
}

export interface ProceedCounselingResponse extends UseCaseCoreResponse {
  counsel: Counsels;
  createdCounselMessage: CounselMessages;
  counselorResponseMessage: CounselMessages;
}
