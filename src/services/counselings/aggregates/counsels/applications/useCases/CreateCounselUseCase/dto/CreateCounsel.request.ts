import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export interface CreateCounselUseCaseRequest {
  userId: UniqueEntityId;
  counselorId: UniqueEntityId;
  counselTechniqueId: UniqueEntityId;
}
