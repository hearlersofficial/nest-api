import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export interface GetCounselListUseCaseRequest {
  userId: UniqueEntityId;
}
