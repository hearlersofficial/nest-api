import { CounselTechniqueTransitionRules } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
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

import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { Dayjs } from "dayjs";

export class CounselTechniqueTransitionRuleInfo {
  constructor(
    public readonly id: CounselTechniqueTransitionRuleId,
    public readonly promptVersionId: PromptVersionId,
    public readonly fromCounselTechniqueId: CounselTechniqueId,
    public readonly toCounselTechniqueId: CounselTechniqueId,
    public readonly priority: number,
    public readonly minNotCompressedMessageCount: number | null,
    public readonly maxNotCompressedMessageCount: number | null,
    public readonly minCurrentTechniqueMessageCount: number | null,
    public readonly maxCurrentTechniqueMessageCount: number | null,
    public readonly requiredImpactDomains: ImpactDomain[] | null,
    public readonly requiredTimeframes: Timeframe[] | null,
    public readonly requiredEmotionPrimaries: EmotionPrimary[] | null,
    public readonly requiredValences: Valence[] | null,
    public readonly requiredArousalLevels: ArousalLevel[] | null,
    public readonly minEmotionIntensity: number | null,
    public readonly maxEmotionIntensity: number | null,
    public readonly requiredPerceivedControls: PerceivedControl[] | null,
    public readonly requiredMotivationStages: MotivationStage[] | null,
    public readonly minSelfEfficacy: number | null,
    public readonly maxSelfEfficacy: number | null,
    public readonly requiredSocialSupportLevels: SocialSupportLevel[] | null,
    public readonly requiredRiskKinds: RiskKind[] | null,
    public readonly minRiskSeverity: number | null,
    public readonly maxRiskSeverity: number | null,
    public readonly requiredSleepQualities: SleepQuality[] | null,
    public readonly requiredPhysicalSymptomsPresent: boolean | null,
    public readonly requiredCognitiveLoads: CognitiveLoad[] | null,
    public readonly requiredAllianceStrengths: AllianceStrength[] | null,
    public readonly requiredConsentToDepth: boolean | null,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(transitionRule: CounselTechniqueTransitionRules): CounselTechniqueTransitionRuleInfo {
    return new CounselTechniqueTransitionRuleInfo(
      transitionRule.id,
      transitionRule.promptVersionId,
      transitionRule.fromCounselTechniqueId,
      transitionRule.toCounselTechniqueId,
      transitionRule.priority,
      transitionRule.minNotCompressedMessageCount,
      transitionRule.maxNotCompressedMessageCount,
      transitionRule.minCurrentTechniqueMessageCount,
      transitionRule.maxCurrentTechniqueMessageCount,
      transitionRule.requiredImpactDomains,
      transitionRule.requiredTimeframes,
      transitionRule.requiredEmotionPrimaries,
      transitionRule.requiredValences,
      transitionRule.requiredArousalLevels,
      transitionRule.minEmotionIntensity,
      transitionRule.maxEmotionIntensity,
      transitionRule.requiredPerceivedControls,
      transitionRule.requiredMotivationStages,
      transitionRule.minSelfEfficacy,
      transitionRule.maxSelfEfficacy,
      transitionRule.requiredSocialSupportLevels,
      transitionRule.requiredRiskKinds,
      transitionRule.minRiskSeverity,
      transitionRule.maxRiskSeverity,
      transitionRule.requiredSleepQualities,
      transitionRule.requiredPhysicalSymptomsPresent,
      transitionRule.requiredCognitiveLoads,
      transitionRule.requiredAllianceStrengths,
      transitionRule.requiredConsentToDepth,
      transitionRule.createdAt,
      transitionRule.updatedAt,
      transitionRule.deletedAt,
    );
  }

  static fromDomainArray(transitionRules: CounselTechniqueTransitionRules[]): CounselTechniqueTransitionRuleInfo[] {
    return transitionRules.map((rule) => CounselTechniqueTransitionRuleInfo.fromDomain(rule));
  }
}
