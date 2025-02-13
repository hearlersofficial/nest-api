import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export interface CreateCounselUseCaseRequest {
  userId: UniqueEntityId;
  counselorId: UniqueEntityId;
}
