import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";

export interface UpdateCounselMessageUseCaseRequest {
  toUpdateCounselMessage: CounselMessages;
}
