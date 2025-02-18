import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export interface GetInstructionPromptUseCaseRequest {
  instructionId: UniqueEntityId;
}
