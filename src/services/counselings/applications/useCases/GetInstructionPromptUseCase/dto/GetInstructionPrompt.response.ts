import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";

export interface GetInstructionPromptUseCaseResponse extends UseCaseCoreResponse {
  prompt?: string;
}
