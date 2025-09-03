import { TemporaryVersionManager } from "~counselings/applications/counsel-prompt-managements/temporary-version.manager";
import { CounselTechniquesService } from "~counselings/domains/counsel-techniques/counsel-techniques.service";
import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
import { CounselTechniqueTransitionRuleInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rule.info";
import { PersonaPromptInfo } from "~counselings/domains/persona-prompts/models/persona-prompt.info";
import { PersonaPromptsService } from "~counselings/domains/persona-prompts/persona-prompts.service";
import { PromptActivateHistoryInfo } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history.info";
import { PromptActivateHistoryService } from "~counselings/domains/prompt-activate-history/prompt-activate-history.service";
import { PromptVersionInfo } from "~counselings/domains/prompt-versions/models/prompt-version.info";
import { PromptVersionsService } from "~counselings/domains/prompt-versions/prompt-versions.service";
import { TonePromptInfo } from "~counselings/domains/tone-prompts/models/tone-prompt.info";
import { TonePromptsService } from "~counselings/domains/tone-prompts/tone-prompts.service";
import {
  AllianceStrength,
  ArousalLevel,
  CognitiveLoad,
  EmotionPrimary,
  ImpactDomain,
  MotivationStage,
  PerceivedControl,
  RiskKind,
  SleepQuality,
  SocialSupportLevel,
  Timeframe,
  Valence,
} from "~proto/com/hearlers/v1/model/counsel_pb";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { getNowDayjs } from "~common/shared/utils/date";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
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

  async findPersonaPrompts(param: {
    promptVersionId?: PromptVersionId;
    counselorId?: CounselorId;
  }): Promise<PersonaPromptInfo[]> {
    const { promptVersionId, counselorId } = param;
    return this.personaPromptService.findMany({ promptVersionId, counselorId });
  }

  /**
   * 임시 버전에서 페르소나 프롬프트 수정 (없으면 재화 생성)
   * @param param - { counselorId: CounselorId; body: string }
   * @returns PersonaPromptInfo
   */
  @Transactional()
  async updatePersonaPromptInTemporaryVersion(param: {
    counselorId: CounselorId;
    body: string;
  }): Promise<PersonaPromptInfo> {
    const { counselorId, body } = param;
    const temporaryVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();
    const personaPromptOrNull = await this.personaPromptService
      .getOne({
        uniqueCriteria: { type: "versionAndCounselor", promptVersionId: temporaryVersion.id, counselorId },
      })
      .catch(() => null);

    if (personaPromptOrNull === null) {
      return this.personaPromptService.create({
        promptVersionId: temporaryVersion.id,
        counselorId,
        body,
      });
    } else {
      return this.personaPromptService.update(personaPromptOrNull.id, {
        body,
      });
    }
  }

  async findTonePromptById(param: { tonePromptId: TonePromptId }): Promise<TonePromptInfo> {
    const { tonePromptId } = param;
    return this.tonePromptService.getOne({
      uniqueCriteria: { type: "tonePrompt", id: tonePromptId },
    });
  }

  async findTonePrompts(param: { promptVersionId?: PromptVersionId; toneId?: ToneId }): Promise<TonePromptInfo[]> {
    const { promptVersionId, toneId } = param;
    return this.tonePromptService.findMany({ promptVersionId, toneId });
  }

  /**
   * 임시 버전에서 톤 프롬프트 수정 (없으면 재화 생성)
   * @param param - { toneId: ToneId; body: string }
   * @returns TonePromptInfo
   */
  @Transactional()
  async updateTonePromptInTemporaryVersion(param: { toneId: ToneId; body: string }): Promise<TonePromptInfo> {
    const { toneId, body } = param;

    const promptVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();
    const tonePromptOrNull = await this.tonePromptService
      .getOne({
        uniqueCriteria: { type: "versionAndTone", promptVersionId: promptVersion.id, toneId },
      })
      .catch(() => null);

    if (tonePromptOrNull === null) {
      return this.tonePromptService.create({
        promptVersionId: promptVersion.id,
        toneId,
        body,
      });
    } else {
      return this.tonePromptService.update(tonePromptOrNull.id, {
        body,
      });
    }
  }

  @Transactional()
  async createCounselTechnique(param: {
    name: string;
    temperature: number;
    toneId: ToneId;
    context: string;
    instruction: string;
    isStartTechnique: boolean;
  }): Promise<CounselTechniqueInfo> {
    const { name, temperature, toneId, context, instruction, isStartTechnique } = param;
    const promptVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();
    return this.counselTechniqueService.create({
      name,
      temperature,
      promptVersionId: promptVersion.id,
      toneId,
      context,
      instruction,
      isStartTechnique,
    });
  }

  async findCounselTechniqueById(param: { counselTechniqueId: CounselTechniqueId }): Promise<CounselTechniqueInfo> {
    const { counselTechniqueId } = param;
    return this.counselTechniqueService.getOne({
      uniqueCriteria: { type: "counselTechnique", id: counselTechniqueId },
    });
  }

  async findCounselTechniques(param: {
    promptVersionId?: PromptVersionId;
    toneId?: ToneId;
  }): Promise<CounselTechniqueInfo[]> {
    const { promptVersionId, toneId } = param;
    return this.counselTechniqueService.findMany({ promptVersionId, toneId });
  }

  @Transactional()
  async updateCounselTechnique(param: {
    counselTechniqueId: CounselTechniqueId;
    name?: string;
    temperature?: number;
    context?: string;
    instruction?: string;
    isStartTechnique?: boolean;
  }): Promise<CounselTechniqueInfo> {
    const { counselTechniqueId, name, temperature, context, instruction, isStartTechnique } = param;

    const updatedTechnique = await this.counselTechniqueService.updateCounselTechnique({
      counselTechniqueId,
      name,
      temperature,
      context,
      instruction,
      isStartTechnique,
    });

    return updatedTechnique;
  }

  async findPromptActivateHistories(param: {
    promptVersionId?: PromptVersionId;
  }): Promise<PromptActivateHistoryInfo[]> {
    const { promptVersionId } = param;
    return this.promptActivateHistoryService.getMany({ promptVersionId, orderBy: { id: "DESC" } });
  }

  @Transactional()
  async createCounselTechniqueTransitionRule(param: {
    fromCounselTechniqueId: CounselTechniqueId;
    toCounselTechniqueId: CounselTechniqueId;
    priority: number;
    minNotCompressedMessageCount: number | null;
    maxNotCompressedMessageCount: number | null;
    minCurrentTechniqueMessageCount: number | null;
    maxCurrentTechniqueMessageCount: number | null;
    requiredImpactDomains: ImpactDomain[];
    requiredTimeframes: Timeframe[];
    requiredEmotionPrimaries: EmotionPrimary[];
    requiredValences: Valence[];
    requiredArousalLevels: ArousalLevel[];
    minEmotionIntensity: number | null;
    maxEmotionIntensity: number | null;
    requiredPerceivedControls: PerceivedControl[];
    requiredMotivationStages: MotivationStage[];
    minSelfEfficacy: number | null;
    maxSelfEfficacy: number | null;
    requiredSocialSupportLevels: SocialSupportLevel[];
    requiredRiskKinds: RiskKind[];
    minRiskSeverity: number | null;
    maxRiskSeverity: number | null;
    requiredSleepQualities: SleepQuality[];
    requiredPhysicalSymptomsPresent: boolean | null;
    requiredCognitiveLoads: CognitiveLoad[];
    requiredAllianceStrengths: AllianceStrength[];
    requiredConsentToDepth: boolean | null;
  }): Promise<CounselTechniqueTransitionRuleInfo> {
    const temporaryVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();
    return this.counselTechniqueService.createTransitionRule({
      ...param,
      promptVersionId: temporaryVersion.id,
    });
  }

  @Transactional()
  async updateCounselTechniqueTransitionRule(param: {
    counselTechniqueTransitionRuleId: CounselTechniqueTransitionRuleId;
    priority: number;
    minNotCompressedMessageCount: number | null;
    maxNotCompressedMessageCount: number | null;
    minCurrentTechniqueMessageCount: number | null;
    maxCurrentTechniqueMessageCount: number | null;
    requiredImpactDomains: ImpactDomain[];
    requiredTimeframes: Timeframe[];
    requiredEmotionPrimaries: EmotionPrimary[];
    requiredValences: Valence[];
    requiredArousalLevels: ArousalLevel[];
    minEmotionIntensity: number | null;
    maxEmotionIntensity: number | null;
    requiredPerceivedControls: PerceivedControl[];
    requiredMotivationStages: MotivationStage[];
    minSelfEfficacy: number | null;
    maxSelfEfficacy: number | null;
    requiredSocialSupportLevels: SocialSupportLevel[];
    requiredRiskKinds: RiskKind[];
    minRiskSeverity: number | null;
    maxRiskSeverity: number | null;
    requiredSleepQualities: SleepQuality[];
    requiredPhysicalSymptomsPresent: boolean | null;
    requiredCognitiveLoads: CognitiveLoad[];
    requiredAllianceStrengths: AllianceStrength[];
    requiredConsentToDepth: boolean | null;
  }): Promise<CounselTechniqueTransitionRuleInfo> {
    const temporaryVersion = await this.temporaryVersionManager.getOrCreateTemporaryOne();
    const originalTransitionRule = await this.counselTechniqueService.getOneTransitionRule({
      uniqueCriteria: { type: "counselTechniqueTransitionRule", id: param.counselTechniqueTransitionRuleId },
    });

    if (!originalTransitionRule.promptVersionId.equals(temporaryVersion.id)) {
      throw new HttpStatusBasedRpcException(HttpStatus.FORBIDDEN, "임시 버전에서만 수정할 수 있습니다.");
    }

    return this.counselTechniqueService.updateTransitionRule(param);
  }

  async findCounselTechniqueTransitionRules(param: {
    fromCounselTechniqueId?: CounselTechniqueId;
    toCounselTechniqueId?: CounselTechniqueId;
    promptVersionId?: PromptVersionId;
  }): Promise<CounselTechniqueTransitionRuleInfo[]> {
    const { fromCounselTechniqueId, toCounselTechniqueId, promptVersionId } = param;
    return this.counselTechniqueService.findManyTransitionRules({
      fromCounselTechniqueId,
      toCounselTechniqueId,
      promptVersionId,
    });
  }

  async findCounselTechniqueTransitionRuleById(param: {
    counselTechniqueTransitionRuleId: CounselTechniqueTransitionRuleId;
  }): Promise<CounselTechniqueTransitionRuleInfo> {
    const { counselTechniqueTransitionRuleId } = param;
    return this.counselTechniqueService.getOneTransitionRule({
      uniqueCriteria: { type: "counselTechniqueTransitionRule", id: counselTechniqueTransitionRuleId },
    });
  }

  async findManyCounselTechniqueTransitionRules(param: {
    fromCounselTechniqueId?: CounselTechniqueId;
    toCounselTechniqueId?: CounselTechniqueId;
    promptVersionId?: PromptVersionId;
  }): Promise<CounselTechniqueTransitionRuleInfo[]> {
    const { fromCounselTechniqueId, toCounselTechniqueId, promptVersionId } = param;
    return this.counselTechniqueService.findManyTransitionRules({
      fromCounselTechniqueId,
      toCounselTechniqueId,
      promptVersionId,
    });
  }

  async deleteCounselTechniqueTransitionRuleById(param: {
    counselTechniqueTransitionRuleId: CounselTechniqueTransitionRuleId;
  }): Promise<void> {
    const { counselTechniqueTransitionRuleId } = param;
    await this.counselTechniqueService.deleteTransitionRule(counselTechniqueTransitionRuleId);
  }
}
