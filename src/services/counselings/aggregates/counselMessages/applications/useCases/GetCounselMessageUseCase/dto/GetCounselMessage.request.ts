import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export interface GetCounselMessageUseCaseRequest {
  counselMessageId: UniqueEntityId;
}
