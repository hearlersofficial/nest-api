import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";

import { ChatCompletionMessageParam } from "openai/resources";

export interface GenerateGptResponseUseCaseRequest {
  prompts: ChatCompletionMessageParam[];
}

export interface GenerateGptResponseUseCaseResponse extends UseCaseCoreResponse {
  response?: string;
}
