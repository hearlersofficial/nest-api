import { UseCase } from "~shared/core/applications/UseCase";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CreateCounselMessageUseCaseRequest } from "~counselings/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/dto/CreateCounselMessage.request";
import { CreateCounselMessageUseCaseResponse } from "~counselings/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/dto/CreateCounselMessage.response";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import {
  COUNSEL_MESSAGE_REPOSITORY,
  CounselMessagesRepositoryPort,
} from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Inject, Injectable } from "@nestjs/common";
<<<<<<< HEAD:src/services/counselings/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/CreateCounselMessageUseCase.ts
=======
import { UseCase } from "~/src/shared/core/applications/UseCase";
import { Result } from "~/src/shared/core/domain/Result";
import { CreateCounselMessageUseCaseRequest } from "~/src/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/dto/CreateCounselMessage.request";
import { CreateCounselMessageUseCaseResponse } from "~/src/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/dto/CreateCounselMessage.response";
import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";
import {
  COUNSEL_MESSAGE_REPOSITORY,
  CounselMessagesRepositoryPort,
} from "~/src/aggregates/counselMessages/infrastructures/counselMessages.repository.port";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/CreateCounselMessageUseCase.ts

@Injectable()
export class CreateCounselMessageUseCase
  implements UseCase<CreateCounselMessageUseCaseRequest, CreateCounselMessageUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessagesRepository: CounselMessagesRepositoryPort,
  ) {}

  async execute(request: CreateCounselMessageUseCaseRequest): Promise<CreateCounselMessageUseCaseResponse> {
    const { counselId, userId, message, isUserMessage } = request;
    const counselMessageOrError: Result<CounselMessages> = CounselMessages.createNew({
      counselId,
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
