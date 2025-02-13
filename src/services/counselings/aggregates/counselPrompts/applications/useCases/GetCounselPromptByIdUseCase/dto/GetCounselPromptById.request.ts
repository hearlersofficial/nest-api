import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export interface GetCounselPromptByIdUseCaseRequest {
  counselPromptId: UniqueEntityId;
}
