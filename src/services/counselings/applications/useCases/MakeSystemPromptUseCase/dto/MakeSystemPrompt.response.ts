import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";

import { ChatCompletionSystemMessageParam } from "openai/resources";

export interface MakeSystemPromptUseCaseResponse extends UseCaseCoreResponse {
  /*
  {
    role: "system",
    content: string,
  }
  */
  prompt?: ChatCompletionSystemMessageParam;
}
