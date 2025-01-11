import { UseCase } from "~shared/core/applications/UseCase";
import { UpdateCounselMessageUseCaseRequest } from "~counselings/aggregates/counselMessages/applications/useCases/UpdateCounselMessageUseCase/dto/UpdateCounselMessage.request";
import { UpdateCounselMessageUseCaseResponse } from "~counselings/aggregates/counselMessages/applications/useCases/UpdateCounselMessageUseCase/dto/UpdateCounselMessage.response";
import {
  COUNSEL_MESSAGE_REPOSITORY,
  CounselMessagesRepositoryPort,
} from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateCounselMessageUseCase
  implements UseCase<UpdateCounselMessageUseCaseRequest, UpdateCounselMessageUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessagesRepository: CounselMessagesRepositoryPort,
  ) {}

  async execute(request?: UpdateCounselMessageUseCaseRequest): Promise<UpdateCounselMessageUseCaseResponse> {
    const { toUpdateCounselMessage } = request;

    const savedCounselMessage = await this.counselMessagesRepository.update(toUpdateCounselMessage);
    return {
      ok: true,
      counselMessage: savedCounselMessage,
    };
  }
}
