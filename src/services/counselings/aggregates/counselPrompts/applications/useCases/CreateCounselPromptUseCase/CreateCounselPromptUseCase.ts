import { UseCase } from "~shared/core/applications/UseCase";
import { Result } from "~shared/core/domain/Result";
import { CreateCounselPromptUseCaseRequest } from "~counselings/aggregates/counselPrompts/applications/useCases/CreateCounselPromptUseCase/dto/CreateCounselPrompt.request";
import { CreateCounselPromptUseCaseResponse } from "~counselings/aggregates/counselPrompts/applications/useCases/CreateCounselPromptUseCase/dto/CreateCounselPrompt.response";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";
import {
  COUNSEL_PROMPT_REPOSITORY,
  CounselPromptsRepositoryPort,
} from "~counselings/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateCounselPromptUseCase
  implements UseCase<CreateCounselPromptUseCaseRequest, CreateCounselPromptUseCaseResponse>
{
  constructor(
    @Inject(COUNSEL_PROMPT_REPOSITORY)
    private readonly counselPromptsRepository: CounselPromptsRepositoryPort,
  ) {}

  async execute(request: CreateCounselPromptUseCaseRequest): Promise<CreateCounselPromptUseCaseResponse> {
    const { persona, context, instruction, tone, additionalPrompt, promptType, description, version } = request;
    const counselPromptOrError: Result<CounselPrompts> = CounselPrompts.createNew({
      persona,
      context,
      instruction,
      tone,
      additionalPrompt,
      promptType,
      description,
      version,
    });
    if (counselPromptOrError.isFailure) {
      return {
        ok: false,
        error: counselPromptOrError.error,
      };
    }
    const counselPrompt: CounselPrompts = counselPromptOrError.value;
    const savedCounselPrompt: CounselPrompts = await this.counselPromptsRepository.create(counselPrompt);
    return {
      ok: true,
      counselPrompt: savedCounselPrompt,
    };
  }
}
