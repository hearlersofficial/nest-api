import { CounselPromptType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { VersionString } from "~/src/shared/types/version.type";

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
