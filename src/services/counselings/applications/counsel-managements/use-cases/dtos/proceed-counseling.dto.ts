import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UseCaseCoreResponse } from "~common/shared-kernel/interfaces/UseCase.response";

export interface ProceedCounselingRequest {
  counselId: UniqueEntityId;
  userMessage: string;
}

export interface ProceedCounselingResponse extends UseCaseCoreResponse {
  counsel: CounselInfo;
  createdCounselMessage: CounselMessageInfo;
  counselorResponseMessage: CounselMessageInfo;
}
