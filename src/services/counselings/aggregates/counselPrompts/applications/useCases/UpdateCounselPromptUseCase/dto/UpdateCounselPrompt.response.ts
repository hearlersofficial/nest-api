import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";

export interface UpdateCounselPromptUseCaseResponse extends UseCaseCoreResponse {
  counselPrompt?: CounselPrompts;
}
