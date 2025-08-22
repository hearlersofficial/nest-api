import { TemporaryVersionManager } from "~counselings/applications/counsel-prompt-managements/temporary-version.manager";
import { CounselTechniquesService } from "~counselings/domains/counsel-techniques/counsel-techniques.service";
import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
import { PersonaPromptInfo } from "~counselings/domains/persona-prompts/models/persona-prompt.info";
import { PersonaPromptsService } from "~counselings/domains/persona-prompts/persona-prompts.service";
import { PromptActivateHistoryInfo } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history.info";
import { PromptActivateHistoryService } from "~counselings/domains/prompt-activate-history/prompt-activate-history.service";
import { PromptVersionInfo } from "~counselings/domains/prompt-versions/models/prompt-version.info";
import { PromptVersionsService } from "~counselings/domains/prompt-versions/prompt-versions.service";
import { TonePromptInfo } from "~counselings/domains/tone-prompts/models/tone-prompt.info";
import { TonePromptsService } from "~counselings/domains/tone-prompts/tone-prompts.service";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { getNowDayjs } from "~common/shared/utils/date";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
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
    private readonly temporaryVersionManager: TemporaryVersionManager,
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
    return this.temporaryVersionManager.getOrCreateTemporaryOne();
  }

  async findActivePromptVersion(): Promise<PromptVersionInfo> {
    return this.promptVersionService.getActiveOne();
  }

  // TODO: 로직 개편으로 인해 일단 동작하게 만들기 위해 삭제 후 생성을 했음
  // 이 케이스에서는 기존 임시버전으로 생성된 상담은 즉각 반영이 되지 않을 것임 조금 별로 같음
  // 추후 임시버전 생성 로직 개편 필요
  @Transactional()
  async loadExistingPromptVersion(param: { promptVersionId: PromptVersionId }): Promise<PromptVersionInfo> {
    const { promptVersionId } = param;
    return this.temporaryVersionManager.loadExistingPromptVersion(promptVersionId);
  }

  @Transactional()
  async saveTemporaryPromptVersion(param: {
    name: string;
    description: string;
    isBookmarked: boolean;
    aiModel: AiModel;
  }): Promise<PromptVersionInfo> {
    const { name, description, isBookmarked, aiModel } = param;

    const temporaryVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();

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
    return this.personaPromptService.getOne({
      uniqueCriteria: { type: "personaPrompt", id: personaPromptId },
    });
  }

  @Transactional()
  async updatePersonaPrompt(param: { counselorId: CounselorId; body: string }): Promise<PersonaPromptInfo> {
    const { counselorId, body } = param;
    const temporaryVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();
    const personaPrompt = await this.personaPromptService.getOne({
      uniqueCriteria: { type: "versionAndCounselor", promptVersionId: temporaryVersion.id, counselorId },
    });
    if (!personaPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PersonaPrompt not found");
    }
    await this.personaPromptService.update(personaPrompt.id, {
      body,
    });

    return personaPrompt;
  }

  async findTonePromptById(param: { tonePromptId: TonePromptId }): Promise<TonePromptInfo> {
    const { tonePromptId } = param;
    return this.tonePromptService.getOne({
      uniqueCriteria: { type: "tonePrompt", id: tonePromptId },
    });
  }

  @Transactional()
  async updateTonePrompt(param: { toneId: ToneId; body: string }): Promise<TonePromptInfo> {
    const { toneId, body } = param;

    const promptVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();
    const tonePrompt = await this.tonePromptService.getOne({
      uniqueCriteria: { type: "versionAndTone", promptVersionId: promptVersion.id, toneId },
    });
    if (!tonePrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "TonePrompt not found");
    }

    const updatedTonePrompt = await this.tonePromptService.update(tonePrompt.id, {
      body,
    });

    return updatedTonePrompt;
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
    const promptVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();
    return this.counselTechniqueService.create({
      name,
      temperature,
      promptVersionId: promptVersion.id,
      toneId,
      context,
      instruction,
      messageThreshold,
    });
  }

  async findCounselTechniqueById(param: { counselTechniqueId: CounselTechniqueId }): Promise<CounselTechniqueInfo> {
    const { counselTechniqueId } = param;
    return this.counselTechniqueService.getOne({
      uniqueCriteria: { type: "counselTechnique", id: counselTechniqueId },
    });
  }

  @Transactional()
  async updateCounselTechnique(param: {
    counselTechniqueId: CounselTechniqueId;
    name?: string;
    temperature?: number;
    context?: string;
    instruction?: string;
    messageThreshold?: number;
  }): Promise<CounselTechniqueInfo> {
    const { counselTechniqueId, name, temperature, context, instruction, messageThreshold } = param;

    const updatedTechnique = await this.counselTechniqueService.updateCounselTechnique({
      counselTechniqueId,
      name,
      temperature,
      context,
      instruction,
      messageThreshold,
    });

    return updatedTechnique;
  }

  async findPromptActivateHistories(param: {
    promptVersionId?: PromptVersionId;
  }): Promise<PromptActivateHistoryInfo[]> {
    const { promptVersionId } = param;
    return this.promptActivateHistoryService.getMany({ promptVersionId, orderBy: { id: "DESC" } });
  }
}
