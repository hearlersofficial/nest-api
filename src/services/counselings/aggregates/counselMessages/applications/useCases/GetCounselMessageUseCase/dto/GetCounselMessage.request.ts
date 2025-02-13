import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export interface GetCounselMessageUseCaseRequest {
  counselMessageId: UniqueEntityId;
}
