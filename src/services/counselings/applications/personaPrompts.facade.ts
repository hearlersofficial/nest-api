import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetTemporaryPromptVersionUseCase } from "~counselings/applications/use-cases/get-temporary-prompt-version";
import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PersonaPromptsFacade {
  constructor(
    private readonly personaPromptsService: PersonaPromptsService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly getTemporaryPromptVersionUseCase: GetTemporaryPromptVersionUseCase,
  ) {}

  async findPersonaPromptById(params: { personaPromptId: UniqueEntityId }): Promise<PersonaPrompts> {
    const { personaPromptId } = params;
    return this.personaPromptsService.getOne({ personaPromptId });
  }

  @Transactional()
  async updatePersonaPrompt(params: { counselorId: UniqueEntityId; body: string }): Promise<PersonaPrompts> {
    const { counselorId, body } = params;
    const temporaryVersionResult = await this.getTemporaryPromptVersionUseCase.execute({});
    if (!temporaryVersionResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Temporary version creation failed");
    }
    const temporaryVersion = temporaryVersionResult.temporaryVersion;

    // 불변 객체이므로 새롭게 생성
    const newPersonaPrompt = await this.personaPromptsService.create({
      counselorId,
      body,
    });
    temporaryVersion.updatePromptByCounselor({
      counselorId,
      personaPromptId: newPersonaPrompt.id,
    });
    await this.promptVersionsService.update(temporaryVersion);

    return newPersonaPrompt;
  }
}
