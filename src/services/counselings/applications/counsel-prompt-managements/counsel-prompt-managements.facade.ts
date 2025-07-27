import { GPTModelConverter } from "~counselings/applications/counsel-prompt-managements/gpt-model.converter";
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
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
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
    });
  }

  async findPromptVersionById(param: { promptVersionId: UniqueEntityId }): Promise<PromptVersionInfo> {
    const { promptVersionId } = param;
    return this.promptVersionService.getOne({ promptVersionId });
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
  async loadExistingPromptVersion(param: { promptVersionId: UniqueEntityId }): Promise<PromptVersionInfo> {
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
    gptModel: GPTModel;
  }): Promise<PromptVersionInfo> {
    const { name, description, isBookmarked, gptModel } = param;

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
      gptModel,
    });
  }

  @Transactional()
  async updatePromptVersion(param: {
    promptVersionId: UniqueEntityId;
    name?: string;
    description?: string;
    isBookmarked?: boolean;
    gptModel?: GPTModel;
  }): Promise<PromptVersionInfo> {
    const { promptVersionId, name, description, isBookmarked, gptModel } = param;
    return this.promptVersionService.updatePromptVersion({
      promptVersionId,
      name,
      description,
      isBookmarked,
      gptModel,
    });
  }

  @Transactional()
  async activatePromptVersion(param: { promptVersionId: UniqueEntityId }): Promise<PromptVersionInfo> {
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
  async deletePromptVersions(param: { promptVersionIds: UniqueEntityId[] }): Promise<void> {
    const { promptVersionIds } = param;
    await this.promptVersionService.deletePromptVersions({ promptVersionIds });
  }

  async findPersonaPromptById(param: { personaPromptId: UniqueEntityId }): Promise<PersonaPromptInfo> {
    const { personaPromptId } = param;
    return this.personaPromptService.getOne({ personaPromptId });
  }

  @Transactional()
  async updatePersonaPrompt(param: { counselorId: UniqueEntityId; body: string }): Promise<PersonaPromptInfo> {
    const { counselorId, body } = param;

    const personaPrompt = await this.personaPromptService.create({
      counselorId,
      body,
    });
    await this.promptVersionService.updateCounselorScopedPromptInTemporaryVersion({
      counselorId,
      personaPromptId: new UniqueEntityId(personaPrompt.id),
    });

    return personaPrompt;
  }

  async findTonePromptById(param: { tonePromptId: UniqueEntityId }): Promise<TonePromptInfo> {
    const { tonePromptId } = param;
    return this.tonePromptService.getOne({ tonePromptId });
  }

  @Transactional()
  async updateTonePrompt(param: { toneId: UniqueEntityId; body: string }): Promise<TonePromptInfo> {
    const { toneId, body } = param;

    const tonePrompt = await this.tonePromptService.create({
      toneId,
      body,
    });
    await this.promptVersionService.updateToneScopedPromptInTemporaryVersion({
      toneId,
      tonePromptId: new UniqueEntityId(tonePrompt.id),
    });

    return tonePrompt;
  }

  @Transactional()
  async createCounselTechnique(param: {
    name: string;
    toneId: UniqueEntityId;
    context: string;
    instruction: string;
    messageThreshold: number;
  }): Promise<CounselTechniqueInfo> {
    const { name, toneId, context, instruction, messageThreshold } = param;
    return this.counselTechniqueService.create({
      name,
      toneId,
      context,
      instruction,
      messageThreshold,
    });
  }

  async findOrderedCounselTechniques(param: {
    firstCounselTechniqueId: UniqueEntityId;
  }): Promise<CounselTechniqueInfo[]> {
    const { firstCounselTechniqueId } = param;
    return this.counselTechniqueService.getOrdered({ firstCounselTechniqueId });
  }

  async findCounselTechniqueById(param: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniqueInfo> {
    const { counselTechniqueId } = param;
    return this.counselTechniqueService.getOne({ counselTechniqueId });
  }

  @Transactional()
  async updateCounselTechnique(param: {
    counselTechniqueId: UniqueEntityId;
    name?: string;
    context?: string;
    instruction?: string;
    messageThreshold?: number;
  }): Promise<CounselTechniqueInfo[]> {
    const { counselTechniqueId, name, context, instruction, messageThreshold } = param;

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

    const updatedTechniques = await this.counselTechniqueService.updateCounselTechnique(
      new UniqueEntityId(firstCounselTechniqueId),
      {
        counselTechniqueId,
        name,
        context,
        instruction,
        messageThreshold,
      },
    );

    await this.promptVersionService.updateToneScopedPromptInTemporaryVersion({
      toneId: new UniqueEntityId(counselTechnique.toneId),
      firstCounselTechniqueId: new UniqueEntityId(updatedTechniques[0].id),
    });

    return updatedTechniques;
  }

  @Transactional()
  async saveCounselTechniqueSequence(param: {
    toneId: UniqueEntityId;
    counselTechniqueIds: UniqueEntityId[];
  }): Promise<CounselTechniqueInfo[]> {
    const { toneId, counselTechniqueIds } = param;

    const temporaryVersion = await this.promptVersionService.getTemporaryOne();
    const firstCounselTechniqueId = temporaryVersion.toneScopedPrompts.find(
      (toneScopedPrompt) => toneScopedPrompt.toneId === toneId.getString(),
    )?.firstCounselTechniqueId;

    const updatedTechniques = await this.counselTechniqueService.saveCounselTechniqueSequence({
      originalfirstCounselTechniqueId: firstCounselTechniqueId ? new UniqueEntityId(firstCounselTechniqueId) : null,
      toneId,
      counselTechniqueIds,
    });

    await this.promptVersionService.updateToneScopedPromptInTemporaryVersion({
      toneId,
      firstCounselTechniqueId: new UniqueEntityId(updatedTechniques[0].id),
    });

    return updatedTechniques;
  }

  async findPromptActivateHistories(param: { promptVersionId?: UniqueEntityId }): Promise<PromptActivateHistoryInfo[]> {
    const { promptVersionId } = param;
    return this.promptActivateHistoryService.getMany({ promptVersionId });
  }

  async findGptModel(): Promise<GPTModel> {
    const model = this.assistantAgent.getModel();
    return GPTModelConverter.convertStringToGPTModel(model);
  }

  async setGptModel(param: { gptModel: GPTModel }): Promise<GPTModel> {
    const { gptModel } = param;
    this.assistantAgent.setModel(GPTModelConverter.convertGPTModelToString(gptModel));
    return gptModel;
  }
}
