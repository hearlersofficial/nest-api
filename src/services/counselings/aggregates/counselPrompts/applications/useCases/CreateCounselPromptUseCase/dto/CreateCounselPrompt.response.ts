import { UseCaseCoreResponse } from "~/src/shared/core/applications/UseCase.response";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";

export interface CreateCounselPromptUseCaseResponse extends UseCaseCoreResponse {
  counselPrompt?: CounselPrompts;
}
