import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { UseCaseCoreResponse } from "~common/shared-kernel/interfaces/UseCase.response";

export interface ProceedCounselingRequest {
  counsel: Counsels;
  userMessage: string;
}

export interface ProceedCounselingResponse extends UseCaseCoreResponse {
  counsel: Counsels;
  createdCounselMessage: CounselMessages;
  counselorResponseMessage: CounselMessages;
}
