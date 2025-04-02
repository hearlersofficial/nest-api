import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetTemporaryPromptVersionUseCase } from "~counselings/applications/use-cases/get-temporary-prompt-version";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";
import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class TonePromptsFacade {
  constructor(
    private readonly tonePromptsService: TonePromptsService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly getTemporaryPromptVersionUseCase: GetTemporaryPromptVersionUseCase,
  ) {}
  async findTonePromptById(params: { tonePromptId: UniqueEntityId }): Promise<TonePrompts> {
    const { tonePromptId } = params;
    return this.tonePromptsService.getOne({ tonePromptId });
  }

  @Transactional()
  async updateTonePrompt(params: { toneId: UniqueEntityId; body: string }): Promise<TonePrompts> {
    const { toneId, body } = params;
    const temporaryVersionResult = await this.getTemporaryPromptVersionUseCase.execute({});
    if (!temporaryVersionResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Temporary version creation failed");
    }
    const temporaryVersion = temporaryVersionResult.temporaryVersion;

    // 불변 객체이므로 새롭게 생성
    const newTonePrompt = await this.tonePromptsService.create({
      toneId,
      body,
    });
    temporaryVersion.updatePromptByTone({
      toneId,
      tonePromptId: newTonePrompt.id,
    });
    await this.promptVersionsService.update(temporaryVersion);

    return newTonePrompt;
  }
}
