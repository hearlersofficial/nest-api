import { UseCaseCoreResponse } from "~/src/shared/core/applications/UseCase.response";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";

export interface GetCounselPromptByTypeUseCaseResponse extends UseCaseCoreResponse {
  counselPrompt?: CounselPrompts;
}
