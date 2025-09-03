import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
import { CounselTechniqueTransitionRuleInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rule.info";
import { PersonaPromptInfo } from "~counselings/domains/persona-prompts/models/persona-prompt.info";
import { PromptActivateHistoryInfo } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history.info";
import { PromptVersionInfo } from "~counselings/domains/prompt-versions/models/prompt-version.info";
import { TonePromptInfo } from "~counselings/domains/tone-prompts/models/tone-prompt.info";
import {
  CounselTechnique,
  CounselTechniqueSchema,
  CounselTechniqueTransitionRule,
  CounselTechniqueTransitionRuleSchema,
  PersonaPrompt,
  PersonaPromptSchema,
  PromptActivateHistory,
  PromptActivateHistorySchema,
  PromptVersion,
  PromptVersionSchema,
  TonePrompt,
  TonePromptSchema,
} from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselPromptsMapper {
  static toPromptVersionProto(promptVersion: null): null;
  static toPromptVersionProto(promptVersion: PromptVersionInfo): PromptVersion;
  static toPromptVersionProto(promptVersion: PromptVersionInfo | null): PromptVersion | null;
  static toPromptVersionProto(promptVersion: PromptVersionInfo | null): PromptVersion | null {
    if (!promptVersion) {
      return null;
    }

    return create(PromptVersionSchema, {
      id: promptVersion.id.getString(),
      name: promptVersion.name,
      description: promptVersion.description,
      isActive: promptVersion.isActive,
      isTemporary: promptVersion.isTemporary,
      isBookmarked: promptVersion.isBookmarked,
      aiModel: promptVersion.aiModel,
      createdAt: promptVersion.createdAt.toISOString(),
      updatedAt: promptVersion.updatedAt.toISOString(),
      deletedAt: promptVersion.deletedAt ? promptVersion.deletedAt.toISOString() : undefined,
    });
  }

  static toPersonaPromptProto(personaPrompt: null): null;
  static toPersonaPromptProto(personaPrompt: PersonaPromptInfo): PersonaPrompt;
  static toPersonaPromptProto(personaPrompt: PersonaPromptInfo | null): PersonaPrompt | null;
  static toPersonaPromptProto(personaPrompt: PersonaPromptInfo | null): PersonaPrompt | null {
    if (!personaPrompt) {
      return null;
    }
    return create(PersonaPromptSchema, {
      id: personaPrompt.id.getString(),
      promptVersionId: personaPrompt.promptVersionId.getString(),
      body: personaPrompt.body,
      counselorId: personaPrompt.counselorId.getString(),
      createdAt: personaPrompt.createdAt.toISOString(),
      updatedAt: personaPrompt.updatedAt.toISOString(),
      deletedAt: personaPrompt.deletedAt ? personaPrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toTonePromptProto(tonePrompt: null): null;
  static toTonePromptProto(tonePrompt: TonePromptInfo): TonePrompt;
  static toTonePromptProto(tonePrompt: TonePromptInfo | null): TonePrompt | null;
  static toTonePromptProto(tonePrompt: TonePromptInfo | null): TonePrompt | null {
    if (!tonePrompt) {
      return null;
    }
    return create(TonePromptSchema, {
      id: tonePrompt.id.getString(),
      promptVersionId: tonePrompt.promptVersionId.getString(),
      body: tonePrompt.body,
      toneId: tonePrompt.toneId.getString(),
      createdAt: tonePrompt.createdAt.toISOString(),
      updatedAt: tonePrompt.updatedAt.toISOString(),
      deletedAt: tonePrompt.deletedAt ? tonePrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselTechniqueProto(counselTechnique: null): null;
  static toCounselTechniqueProto(counselTechnique: CounselTechniqueInfo): CounselTechnique;
  static toCounselTechniqueProto(counselTechnique: CounselTechniqueInfo | null): CounselTechnique | null;
  static toCounselTechniqueProto(counselTechnique: CounselTechniqueInfo | null): CounselTechnique | null {
    if (!counselTechnique) {
      return null;
    }
    return create(CounselTechniqueSchema, {
      id: counselTechnique.id.getString(),
      promptVersionId: counselTechnique.promptVersionId.getString(),
      name: counselTechnique.name,
      toneId: counselTechnique.toneId.getString(),
      context: counselTechnique.context,
      instruction: counselTechnique.instruction,
      isStartTechnique: counselTechnique.isStartTechnique,
      temperature: counselTechnique.temperature,
      createdAt: counselTechnique.createdAt.toISOString(),
      updatedAt: counselTechnique.updatedAt.toISOString(),
      deletedAt: counselTechnique.deletedAt ? counselTechnique.deletedAt.toISOString() : undefined,
    });
  }

  // PromptActivateHistory
  static toPromptActivateHistoryProto(promptActivateHistory: null): null;
  static toPromptActivateHistoryProto(promptActivateHistory: PromptActivateHistoryInfo): PromptActivateHistory;
  static toPromptActivateHistoryProto(
    promptActivateHistory: PromptActivateHistoryInfo | null,
  ): PromptActivateHistory | null;
  static toPromptActivateHistoryProto(
    promptActivateHistory: PromptActivateHistoryInfo | null,
  ): PromptActivateHistory | null {
    if (!promptActivateHistory) {
      return null;
    }
    return create(PromptActivateHistorySchema, {
      id: promptActivateHistory.id,
      promptVersionId: promptActivateHistory.promptVersionId,
      activatedAt: promptActivateHistory.activatedAt.toISOString(),
      createdAt: promptActivateHistory.createdAt.toISOString(),
      updatedAt: promptActivateHistory.updatedAt.toISOString(),
      deletedAt: promptActivateHistory.deletedAt ? promptActivateHistory.deletedAt.toISOString() : undefined,
    });
  }

  static toTransitionRuleProto(transitionRule: null): null;
  static toTransitionRuleProto(transitionRule: CounselTechniqueTransitionRuleInfo): CounselTechniqueTransitionRule;
  static toTransitionRuleProto(
    transitionRule: CounselTechniqueTransitionRuleInfo | null,
  ): CounselTechniqueTransitionRule | null;
  static toTransitionRuleProto(
    transitionRule: CounselTechniqueTransitionRuleInfo | null,
  ): CounselTechniqueTransitionRule | null {
    if (!transitionRule) {
      return null;
    }

    return create(CounselTechniqueTransitionRuleSchema, {
      id: transitionRule.id.getString(),
      promptVersionId: transitionRule.promptVersionId.getString(),
      fromCounselTechniqueId: transitionRule.fromCounselTechniqueId.getString(),
      toCounselTechniqueId: transitionRule.toCounselTechniqueId.getString(),
      priority: transitionRule.priority,
      minCurrentTechniqueMessageCount: transitionRule.minCurrentTechniqueMessageCount ?? undefined,
      maxCurrentTechniqueMessageCount: transitionRule.maxCurrentTechniqueMessageCount ?? undefined,
      requiredImpactDomains: transitionRule.requiredImpactDomains ?? [],
      requiredTimeframes: transitionRule.requiredTimeframes,
      requiredEmotionPrimaries: transitionRule.requiredEmotionPrimaries,
      requiredValences: transitionRule.requiredValences,
      requiredArousalLevels: transitionRule.requiredArousalLevels,
      minEmotionIntensity: transitionRule.minEmotionIntensity ?? undefined,
      maxEmotionIntensity: transitionRule.maxEmotionIntensity ?? undefined,
      requiredPerceivedControls: transitionRule.requiredPerceivedControls,
      requiredMotivationStages: transitionRule.requiredMotivationStages,
      minSelfEfficacy: transitionRule.minSelfEfficacy ?? undefined,
      maxSelfEfficacy: transitionRule.maxSelfEfficacy ?? undefined,
      requiredSocialSupportLevels: transitionRule.requiredSocialSupportLevels,
      requiredRiskKinds: transitionRule.requiredRiskKinds,
      minRiskSeverity: transitionRule.minRiskSeverity ?? undefined,
      maxRiskSeverity: transitionRule.maxRiskSeverity ?? undefined,
      requiredSleepQualities: transitionRule.requiredSleepQualities,
      requiredPhysicalSymptomsPresent: transitionRule.requiredPhysicalSymptomsPresent ?? undefined,
      requiredCognitiveLoads: transitionRule.requiredCognitiveLoads,
      requiredAllianceStrengths: transitionRule.requiredAllianceStrengths,
      requiredConsentToDepth: transitionRule.requiredConsentToDepth ?? undefined,
      createdAt: transitionRule.createdAt.toISOString(),
      updatedAt: transitionRule.updatedAt.toISOString(),
      deletedAt: transitionRule.deletedAt ? transitionRule.deletedAt.toISOString() : undefined,
    });
  }
}
