import { UseCase } from "~shared/core/applications/UseCase";
import { GetCounselPromptByTypeUseCaseRequest } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptByTypeUseCase/dto/GetCounselPromptByType.request";
import { GetCounselPromptByTypeUseCaseResponse } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptByTypeUseCase/dto/GetCounselPromptByType.response";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";
import {
  COUNSEL_PROMPT_REPOSITORY,
  CounselPromptsRepositoryPort,
} from "~counselings/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselPromptByTypeUseCase
  implements UseCase<GetCounselPromptByTypeUseCaseRequest, GetCounselPromptByTypeUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_PROMPT_REPOSITORY)
    private readonly counselPromptsRepository: CounselPromptsRepositoryPort,
  ) {}

  async execute(request: GetCounselPromptByTypeUseCaseRequest): Promise<GetCounselPromptByTypeUseCaseResponse> {
    const { promptType } = request;
    const counselPrompt: CounselPrompts = await this.counselPromptsRepository.findOne({ promptType });
    return {
      ok: true,
      counselPrompt,
    };
  }
}
