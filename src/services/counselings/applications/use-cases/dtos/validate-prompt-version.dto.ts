import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";

export interface ValidatePromptVersionRequest {
  promptVersion: PromptVersions;
}

export interface ValidatePromptVersionResponse extends UseCaseCoreResponse {
  isValid: boolean;
}
