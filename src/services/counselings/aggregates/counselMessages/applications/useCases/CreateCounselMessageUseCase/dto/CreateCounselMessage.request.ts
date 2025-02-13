import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export interface CreateCounselMessageUseCaseRequest {
  counselId: UniqueEntityId;
  userId: UniqueEntityId;
  message: string;
  isUserMessage: boolean;
}
