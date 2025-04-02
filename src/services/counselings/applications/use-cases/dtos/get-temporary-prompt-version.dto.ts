import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";

export interface GetTemporaryPromptVersionUseCaseRequest {}

export interface GetTemporaryPromptVersionUseCaseResponse extends UseCaseCoreResponse {
  temporaryVersion: PromptVersions;
}
