import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export interface GetCounselMessageListUseCaseRequest {
  counselId: UniqueEntityId;
}
