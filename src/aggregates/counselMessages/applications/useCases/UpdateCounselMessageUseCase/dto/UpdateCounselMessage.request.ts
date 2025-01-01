import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";

export interface UpdateCounselMessageUseCaseRequest {
  toUpdateCounselMessage: CounselMessages;
}
