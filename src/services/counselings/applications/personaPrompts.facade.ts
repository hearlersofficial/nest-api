import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PersonaPromptsFacade {
  constructor(
    private readonly personaPromptsService: PersonaPromptsService,
    private readonly promptVersionsService: PromptVersionsService,
  ) {}

  async findPersonaPromptById(params: { personaPromptId: UniqueEntityId }): Promise<PersonaPrompts> {
    const { personaPromptId } = params;
    return this.personaPromptsService.getOne({ personaPromptId });
  }

  @Transactional()
  async updatePersonaPrompt(params: { counselorId: UniqueEntityId; body: string }): Promise<PersonaPrompts> {
    const { counselorId, body } = params;

    const temporaryVersion = await this.promptVersionsService.getTemporaryOne();

    // 불변 객체이므로 새롭게 생성
    const newPersonaPrompt = await this.personaPromptsService.create({
      counselorId,
      body,
    });
    temporaryVersion.updateCounselorScopedPrompt({
      counselorId,
      personaPromptId: newPersonaPrompt.id,
    });
    await this.promptVersionsService.update(temporaryVersion);

    return newPersonaPrompt;
  }
}
