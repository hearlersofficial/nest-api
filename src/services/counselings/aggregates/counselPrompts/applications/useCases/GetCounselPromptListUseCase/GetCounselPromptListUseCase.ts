import { UseCase } from "~shared/core/applications/UseCase";
import { GetCounselPromptListUseCaseRequest } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptListUseCase/dto/GetCounselPromptList.request";
import { GetCounselPromptListUseCaseResponse } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptListUseCase/dto/GetCounselPromptList.response";
import {
  COUNSEL_PROMPT_REPOSITORY,
  CounselPromptsRepositoryPort,
} from "~counselings/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselPromptListUseCase
  implements UseCase<GetCounselPromptListUseCaseRequest, GetCounselPromptListUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_PROMPT_REPOSITORY)
    private readonly counselPromptRepository: CounselPromptsRepositoryPort,
  ) {}

  async execute(request: GetCounselPromptListUseCaseRequest): Promise<GetCounselPromptListUseCaseResponse> {
    const { promptType } = request;
    const counselPromptList = await this.counselPromptRepository.findMany({ promptType });
    return {
      ok: true,
      counselPromptList,
    };
  }
}
