import { ValidatePromptVersionUseCase } from "~counselings/applications/counsel-prompt-managements/use-cases/validate-prompt-version";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";
import { PersonaPromptInfo } from "~counselings/domains/personaPrompts/models/personaPrompt.info";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { PromptActivateHistoryInfo } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory.info";
import { PromptActivateHistoryService } from "~counselings/domains/promptActivateHistory/promptActivateHistory.service";
import { PromptVersionInfo } from "~counselings/domains/promptVersions/models/promptVersion.info";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";
import { TonePromptInfo } from "~counselings/domains/tonePrompts/models/tonePrompt.info";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { getNowDayjs } from "~common/shared/utils/date";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselPromptManagementsFacade {
  constructor(
    private readonly promptVersionService: PromptVersionsService,
    private readonly personaPromptService: PersonaPromptsService,
    private readonly tonePromptService: TonePromptsService,
    private readonly counselTechniqueService: CounselTechniquesService,
    private readonly promptActivateHistoryService: PromptActivateHistoryService,
    @Inject(ASSISTANT_AGENT)
    private readonly assistantAgent: AssistantAgent,

    private readonly validatePromptVersionUseCase: ValidatePromptVersionUseCase,
  ) {}

  async findPromptVersions(param: { name?: string; isBookmarked?: boolean }): Promise<PromptVersionInfo[]> {
    const { name, isBookmarked } = param;
    return this.promptVersionService.getMany({
      name,
      isBookmarked,
      orderBy: { id: "DESC" },
    });
  }

  async findPromptVersionById(param: { promptVersionId: PromptVersionId }): Promise<PromptVersionInfo> {
    const { promptVersionId } = param;
    return this.promptVersionService.getOne({ promptVersionId, withDeleted: true });
  }

  // 내부적으로 생성로직 포함
  @Transactional()
  async findTemporaryPromptVersion(): Promise<PromptVersionInfo> {
    return this.promptVersionService.getTemporaryOne();
  }

  async findActivePromptVersion(): Promise<PromptVersionInfo> {
    return this.promptVersionService.getActiveOne();
  }

  @Transactional()
  async loadExistingPromptVersion(param: { promptVersionId: PromptVersionId }): Promise<PromptVersionInfo> {
    const { promptVersionId } = param;
    return this.promptVersionService.loadExistingPromptVersion({
      promptVersionId,
    });
  }

  @Transactional()
  async saveTemporaryPromptVersion(param: {
    name: string;
    description: string;
    isBookmarked: boolean;
    aiModel: AiModel;
  }): Promise<PromptVersionInfo> {
    const { name, description, isBookmarked, aiModel } = param;

    const temporaryVersion = await this.promptVersionService.getTemporaryOne();
    const validatePromptVersionResult = await this.validatePromptVersionUseCase.execute({
      promptVersion: temporaryVersion,
    });
    if (!validatePromptVersionResult.ok) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        validatePromptVersionResult.error as string,
      );
    }

    return this.promptVersionService.saveTemporaryPromptVersion({
      name,
      description,
      isBookmarked,
      aiModel,
    });
  }

  @Transactional()
  async updatePromptVersion(param: {
    promptVersionId: PromptVersionId;
    name?: string;
    description?: string;
    isBookmarked?: boolean;
    aiModel?: AiModel;
  }): Promise<PromptVersionInfo> {
    const { promptVersionId, name, description, isBookmarked, aiModel } = param;
    return this.promptVersionService.updatePromptVersion({
      promptVersionId,
      name,
      description,
      isBookmarked,
      aiModel,
    });
  }

  @Transactional()
  async activatePromptVersion(param: { promptVersionId: PromptVersionId }): Promise<PromptVersionInfo> {
    const { promptVersionId } = param;

    const promptVersion = await this.promptVersionService.getOne({ promptVersionId });
    const validatePromptVersionResult = await this.validatePromptVersionUseCase.execute({
      promptVersion,
    });
    if (!validatePromptVersionResult.ok) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        validatePromptVersionResult.error as string,
      );
    }

    await this.promptActivateHistoryService.create({
      promptVersionId,
      activatedAt: getNowDayjs(),
    });

    return this.promptVersionService.activatePromptVersion({ promptVersionId });
  }

  @Transactional()
  async deletePromptVersions(param: { promptVersionIds: PromptVersionId[] }): Promise<void> {
    const { promptVersionIds } = param;
    await this.promptVersionService.deletePromptVersions({ promptVersionIds });
  }

  async findPersonaPromptById(param: { personaPromptId: PersonaPromptId }): Promise<PersonaPromptInfo> {
    const { personaPromptId } = param;
    return this.personaPromptService.getOne({ personaPromptId });
  }

  @Transactional()
  async updatePersonaPrompt(param: { counselorId: CounselorId; body: string }): Promise<PersonaPromptInfo> {
    const { counselorId, body } = param;

    const personaPrompt = await this.personaPromptService.create({
      counselorId,
      body,
    });
    await this.promptVersionService.updateCounselorScopedPromptInTemporaryVersion({
      counselorId,
      personaPromptId: personaPrompt.id,
    });

    return personaPrompt;
  }

  async findTonePromptById(param: { tonePromptId: TonePromptId }): Promise<TonePromptInfo> {
    const { tonePromptId } = param;
    return this.tonePromptService.getOne({ tonePromptId });
  }

  @Transactional()
  async updateTonePrompt(param: { toneId: ToneId; body: string }): Promise<TonePromptInfo> {
    const { toneId, body } = param;

    const tonePrompt = await this.tonePromptService.create({
      toneId,
      body,
    });
    await this.promptVersionService.updateToneScopedPromptInTemporaryVersion({
      toneId,
      tonePromptId: tonePrompt.id,
    });

    return tonePrompt;
  }

  @Transactional()
  async createCounselTechnique(param: {
    name: string;
    temperature: number;
    toneId: ToneId;
    context: string;
    instruction: string;
    messageThreshold: number;
  }): Promise<CounselTechniqueInfo> {
    const { name, temperature, toneId, context, instruction, messageThreshold } = param;
    return this.counselTechniqueService.create({
      name,
      temperature,
      toneId,
      context,
      instruction,
      messageThreshold,
    });
  }

  async findOrderedCounselTechniques(param: {
    firstCounselTechniqueId: CounselTechniqueId;
  }): Promise<CounselTechniqueInfo[]> {
    const { firstCounselTechniqueId } = param;
    return this.counselTechniqueService.getOrdered({ firstCounselTechniqueId });
  }

  async findCounselTechniqueById(param: { counselTechniqueId: CounselTechniqueId }): Promise<CounselTechniqueInfo> {
    const { counselTechniqueId } = param;
    return this.counselTechniqueService.getOne({ counselTechniqueId });
  }

  @Transactional()
  async updateCounselTechnique(param: {
    counselTechniqueId: CounselTechniqueId;
    name?: string;
    temperature?: number;
    context?: string;
    instruction?: string;
    messageThreshold?: number;
  }): Promise<CounselTechniqueInfo[]> {
    const { counselTechniqueId, name, temperature, context, instruction, messageThreshold } = param;

    const counselTechnique = await this.counselTechniqueService.getOne({ counselTechniqueId });
    const temporaryVersion = await this.promptVersionService.getTemporaryOne();
    const firstCounselTechniqueId = temporaryVersion.toneScopedPrompts.find(
      (toneScopedPrompt) => toneScopedPrompt.toneId === counselTechnique.toneId,
    )?.firstCounselTechniqueId;
    if (!firstCounselTechniqueId) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "First counsel technique at toneId not found",
      );
    }

    const updatedTechniques = await this.counselTechniqueService.updateCounselTechnique(firstCounselTechniqueId, {
      counselTechniqueId,
      name,
      temperature,
      context,
      instruction,
      messageThreshold,
    });

    await this.promptVersionService.updateToneScopedPromptInTemporaryVersion({
      toneId: counselTechnique.toneId,
      firstCounselTechniqueId: updatedTechniques[0].id,
    });

    return updatedTechniques;
  }

  @Transactional()
  async saveCounselTechniqueSequence(param: {
    toneId: ToneId;
    counselTechniqueIds: CounselTechniqueId[];
  }): Promise<CounselTechniqueInfo[]> {
    const { toneId, counselTechniqueIds } = param;

    const temporaryVersion = await this.promptVersionService.getTemporaryOne();
    const firstCounselTechniqueId = temporaryVersion.toneScopedPrompts.find(
      (toneScopedPrompt) => toneScopedPrompt.toneId === toneId,
    )?.firstCounselTechniqueId;

    const updatedTechniques = await this.counselTechniqueService.saveCounselTechniqueSequence({
      originalfirstCounselTechniqueId: firstCounselTechniqueId ?? null,
      toneId,
      counselTechniqueIds,
    });

    await this.promptVersionService.updateToneScopedPromptInTemporaryVersion({
      toneId,
      firstCounselTechniqueId: updatedTechniques[0].id,
    });

    return updatedTechniques;
  }

  async findPromptActivateHistories(param: {
    promptVersionId?: PromptVersionId;
  }): Promise<PromptActivateHistoryInfo[]> {
    const { promptVersionId } = param;
    return this.promptActivateHistoryService.getMany({ promptVersionId, orderBy: { id: "DESC" } });
  }
}
