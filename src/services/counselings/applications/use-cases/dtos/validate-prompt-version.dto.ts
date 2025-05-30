import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";

import { UseCaseCoreResponse } from "~common/shared-kernel/interfaces/UseCase.response";

export interface ValidatePromptVersionRequest {
  promptVersion: PromptVersions;
}

export interface ValidatePromptVersionResponse extends UseCaseCoreResponse {
  isValid: boolean;
}
