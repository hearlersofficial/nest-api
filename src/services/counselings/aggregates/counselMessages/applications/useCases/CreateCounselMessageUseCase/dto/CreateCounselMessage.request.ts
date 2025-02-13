import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export interface CreateCounselMessageUseCaseRequest {
  counselId: UniqueEntityId;
  userId: UniqueEntityId;
  message: string;
  isUserMessage: boolean;
}
