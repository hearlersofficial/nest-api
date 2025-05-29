import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { LlmRequest } from "~counselings/domains/llm/models/llm-request";

export interface MakeSystemPromptUseCaseRequest {
  personaPromptId: UniqueEntityId;
  tonePromptId: UniqueEntityId;
  counselTechniqueId: UniqueEntityId;
  userId: UniqueEntityId;
}

export interface MakeSystemPromptUseCaseResponse extends UseCaseCoreResponse {
  prompt?: LlmRequest;
}
