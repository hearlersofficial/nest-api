import { UseCase } from "~/src/shared/core/applications/UseCase";
import { GetCounselPromptByIdUseCaseRequest } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptByIdUseCase/dto/GetCounselPromptById.request";
import { GetCounselPromptByIdUseCaseResponse } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptByIdUseCase/dto/GetCounselPromptById.response";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";
import {
  COUNSEL_PROMPT_REPOSITORY,
  CounselPromptsRepositoryPort,
} from "~counselings/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselPromptByIdUseCase
  implements UseCase<GetCounselPromptByIdUseCaseRequest, GetCounselPromptByIdUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_PROMPT_REPOSITORY)
    private readonly counselPromptsRepository: CounselPromptsRepositoryPort,
  ) {}

  async execute(request: GetCounselPromptByIdUseCaseRequest): Promise<GetCounselPromptByIdUseCaseResponse> {
    const { counselPromptId } = request;
    const counselPrompt: CounselPrompts = await this.counselPromptsRepository.findOne({ id: counselPromptId });
    return {
      ok: true,
      counselPrompt,
    };
  }
}
