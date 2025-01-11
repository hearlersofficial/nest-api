import { UseCase } from "~shared/core/applications/UseCase";
import { UpdateCounselPromptUseCaseRequest } from "~counselings/aggregates/counselPrompts/applications/useCases/UpdateCounselPromptUseCase/dto/UpdateCounselPrompt.request";
import { UpdateCounselPromptUseCaseResponse } from "~counselings/aggregates/counselPrompts/applications/useCases/UpdateCounselPromptUseCase/dto/UpdateCounselPrompt.response";
import {
  COUNSEL_PROMPT_REPOSITORY,
  CounselPromptsRepositoryPort,
} from "~counselings/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateCounselPromptUseCase
  implements UseCase<UpdateCounselPromptUseCaseRequest, UpdateCounselPromptUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_PROMPT_REPOSITORY)
    private readonly counselPromptsRepository: CounselPromptsRepositoryPort,
  ) {}

  async execute(request?: UpdateCounselPromptUseCaseRequest): Promise<UpdateCounselPromptUseCaseResponse> {
    const { toUpdateCounselPrompt } = request;
    const savedCounselPrompt = await this.counselPromptsRepository.update(toUpdateCounselPrompt);
    return {
      ok: true,
      counselPrompt: savedCounselPrompt,
    };
  }
}
