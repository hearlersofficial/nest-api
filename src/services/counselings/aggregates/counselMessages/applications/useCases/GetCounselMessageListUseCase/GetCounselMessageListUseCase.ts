import { UseCase } from "~shared/core/applications/UseCase";
import { GetCounselMessageListUseCaseRequest } from "~counselings/aggregates/counselMessages/applications/useCases/GetCounselMessageListUseCase/dto/GetCounselMessageList.request";
import { GetCounselMessageListUseCaseResponse } from "~counselings/aggregates/counselMessages/applications/useCases/GetCounselMessageListUseCase/dto/GetCounselMessageList.response";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import {
  COUNSEL_MESSAGE_REPOSITORY,
  CounselMessagesRepositoryPort,
} from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselMessageListUseCase
  implements UseCase<GetCounselMessageListUseCaseRequest, GetCounselMessageListUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessagesRepository: CounselMessagesRepositoryPort,
  ) {}

  async execute(request: GetCounselMessageListUseCaseRequest): Promise<GetCounselMessageListUseCaseResponse> {
    const { counselId } = request;
    const counselMessageList: CounselMessages[] = await this.counselMessagesRepository.findMany({ counselId });
    return {
      ok: true,
      counselMessageList,
    };
  }
}
