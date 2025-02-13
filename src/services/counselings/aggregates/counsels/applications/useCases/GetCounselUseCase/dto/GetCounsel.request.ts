import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export interface GetCounselUseCaseRequest {
  counselId: UniqueEntityId;
}
