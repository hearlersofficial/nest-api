import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export interface GetCounselorUseCaseRequest {
  counselorId: UniqueEntityId;
}
