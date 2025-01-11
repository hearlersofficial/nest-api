import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";

export interface GenerateGptResponseUseCaseResponse extends UseCaseCoreResponse {
  response?: string;
}
