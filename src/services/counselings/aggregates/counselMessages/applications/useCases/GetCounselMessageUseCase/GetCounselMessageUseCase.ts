import { UseCase } from "~shared/core/applications/UseCase";
import { GetCounselMessageUseCaseRequest } from "~counselings/aggregates/counselMessages/applications/useCases/GetCounselMessageUseCase/dto/GetCounselMessage.request";
import { GetCounselMessageUseCaseResponse } from "~counselings/aggregates/counselMessages/applications/useCases/GetCounselMessageUseCase/dto/GetCounselMessage.response";
import {
  COUNSEL_MESSAGE_REPOSITORY,
  CounselMessagesRepositoryPort,
} from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselMessageUseCase
  implements UseCase<GetCounselMessageUseCaseRequest, GetCounselMessageUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessagesRepository: CounselMessagesRepositoryPort,
  ) {}

  async execute(request: GetCounselMessageUseCaseRequest): Promise<GetCounselMessageUseCaseResponse> {
    const { counselMessageId } = request;
    const counselMessage = await this.counselMessagesRepository.findOne({ counselMessageId });
    return {
      ok: true,
      counselMessage,
    };
  }
}
