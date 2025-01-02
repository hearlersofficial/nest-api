import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "~/src/shared/core/applications/UseCase";
import { Result } from "~/src/shared/core/domain/Result";
import { CreateCounselMessageUseCaseRequest } from "~/src/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/dto/CreateCounselMessage.request";
import { CreateCounselMessageUseCaseResponse } from "~/src/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/dto/CreateCounselMessage.response";
import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";
import { COUNSEL_MESSAGE_REPOSITORY, CounselMessagesRepositoryPort } from "~/src/aggregates/counselMessages/infrastructures/counselMessages.repository.port";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

@Injectable()
export class CreateCounselMessageUseCase implements UseCase<CreateCounselMessageUseCaseRequest, CreateCounselMessageUseCaseResponse> {
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessagesRepository: CounselMessagesRepositoryPort,
  ) {}

  async execute(request: CreateCounselMessageUseCaseRequest): Promise<CreateCounselMessageUseCaseResponse> {
    const { counselId, userId, message, isUserMessage } = request;
    const counselMessageOrError: Result<CounselMessages> = CounselMessages.createNew({
      counselId: new UniqueEntityId(counselId),
      userId,
      message,
      isUserMessage,
    });
    if (counselMessageOrError.isFailure) {
      return {
        ok: false,
        error: counselMessageOrError.error,
      };
    }
    const counselMessage: CounselMessages = counselMessageOrError.value;
    const savedCounselMessage: CounselMessages = await this.counselMessagesRepository.create(counselMessage);
    return {
      ok: true,
      counselMessage: savedCounselMessage,
    };
  }
}
