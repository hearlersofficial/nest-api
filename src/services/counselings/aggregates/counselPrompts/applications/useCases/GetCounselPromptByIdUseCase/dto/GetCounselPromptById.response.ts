import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";

export interface GetCounselPromptByIdUseCaseResponse extends UseCaseCoreResponse {
  counselPrompt?: CounselPrompts;
}
