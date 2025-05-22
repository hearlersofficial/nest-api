import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { ChatCompletionMessageParam } from "openai/resources";

export interface GenerateGptResponseUseCaseRequest {
  prompts: ChatCompletionMessageParam[];
  model: GPTModel;
}

export interface GenerateGptResponseUseCaseResponse extends UseCaseCoreResponse {
  response?: string;
}
