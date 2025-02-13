import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export interface GetCounselorUseCaseRequest {
  counselorId: UniqueEntityId;
}
