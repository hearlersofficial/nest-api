import { CounselPromptType } from "~proto/com/hearlers/v1/model/counsel_pb";

export interface GetCounselPromptByTypeUseCaseRequest {
  promptType: CounselPromptType;
}
