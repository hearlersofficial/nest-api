import { LlmRequest } from "~counselings/domains/llm/models/llm-request";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UseCaseCoreResponse } from "~common/shared-kernel/interfaces/UseCase.response";

export interface MakeSystemPromptUseCaseRequest {
  personaPromptId: UniqueEntityId;
  tonePromptId: UniqueEntityId;
  counselTechniqueId: UniqueEntityId;
  userId: UniqueEntityId;
}

export interface MakeSystemPromptUseCaseResponse extends UseCaseCoreResponse {
  prompt?: LlmRequest;
}
