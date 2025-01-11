import { VersionString } from "~shared/types/version.type";
import { CounselPromptType } from "~proto/com/hearlers/v1/model/counsel_pb";

export interface CreateCounselPromptUseCaseRequest {
  persona?: string;
  context?: string;
  instruction?: string;
  tone?: string;
  additionalPrompt?: string;
  promptType: CounselPromptType;
  description?: string;
  version?: VersionString;
}
