import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export interface GetCounselUseCaseRequest {
  counselId: UniqueEntityId;
}
