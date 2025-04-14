import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

import { ChatCompletionSystemMessageParam } from "openai/resources";

export interface MakeSystemPromptUseCaseRequest {
  personaPromptId: UniqueEntityId;
  tonePromptId: UniqueEntityId;
  counselTechniqueId: UniqueEntityId;
  userId: UniqueEntityId;
}

export interface MakeSystemPromptUseCaseResponse extends UseCaseCoreResponse {
  /*
  {
    role: "system",
    content: string,
  }
  */
  prompt?: ChatCompletionSystemMessageParam;
}
