import { PromptVersionInfo } from "~counselings/domains/promptVersions/models/promptVersion.info";

import { UseCaseCoreResponse } from "~common/shared-kernel/interfaces/UseCase.response";

export interface ValidatePromptVersionRequest {
  promptVersion: PromptVersionInfo;
}

export interface ValidatePromptVersionResponse extends UseCaseCoreResponse {
  isValid: boolean;
}
