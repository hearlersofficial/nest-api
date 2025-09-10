import { CounselTechniqueTransitionRuleInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rule.info";
import {
  CounselTechniqueTransitionRules,
  CounselTechniqueTransitionRulesNewProps,
  CounselTechniqueTransitionRulesProps,
} from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
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

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";

export class CounselTechniqueTransitionRulesHelper {
  private static getRandomEnumValues<T>(enumObject: any, count: number = 2): T[] {
    const values = Object.values(enumObject).filter((value) => typeof value === "number" && value !== 0);
    return faker.helpers.arrayElements(values, { min: 1, max: Math.min(count, values.length) }) as T[];
  }

  static createCounselTechniqueTransitionRulesProps(
    overrides: Partial<CounselTechniqueTransitionRulesProps> = {},
  ): CounselTechniqueTransitionRulesProps {
    const fromTechniqueId = new CounselTechniqueId();
    const toTechniqueId = new CounselTechniqueId();

    return {
      promptVersionId: new PromptVersionId(),
      fromCounselTechniqueId: fromTechniqueId,
      toCounselTechniqueId: toTechniqueId,
      priority: faker.number.int({ min: 0, max: 100 }),
      minCurrentTechniqueMessageCount: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 10 }) : null,
      maxCurrentTechniqueMessageCount: faker.datatype.boolean() ? faker.number.int({ min: 11, max: 20 }) : null,
      requiredImpactDomains: this.getRandomEnumValues<ImpactDomain>(ImpactDomain, 3),
      requiredTimeframes: this.getRandomEnumValues<Timeframe>(Timeframe, 2),
      requiredEmotionPrimaries: this.getRandomEnumValues<EmotionPrimary>(EmotionPrimary, 3),
      requiredValences: this.getRandomEnumValues<Valence>(Valence, 2),
      requiredArousalLevels: this.getRandomEnumValues<ArousalLevel>(ArousalLevel, 2),
      minEmotionIntensity: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null,
      maxEmotionIntensity: faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null,
      requiredPerceivedControls: this.getRandomEnumValues<PerceivedControl>(PerceivedControl, 2),
      requiredMotivationStages: this.getRandomEnumValues<MotivationStage>(MotivationStage, 3),
      minSelfEfficacy: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null,
      maxSelfEfficacy: faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null,
      requiredSocialSupportLevels: this.getRandomEnumValues<SocialSupportLevel>(SocialSupportLevel, 2),
      requiredRiskKinds: this.getRandomEnumValues<RiskKind>(RiskKind, 2),
      minRiskSeverity: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 1 }) : null,
      maxRiskSeverity: faker.datatype.boolean() ? faker.number.int({ min: 2, max: 3 }) : null,
      requiredSleepQualities: this.getRandomEnumValues<SleepQuality>(SleepQuality, 2),
      requiredPhysicalSymptomsPresent: faker.datatype.boolean() ? faker.datatype.boolean() : null,
      requiredCognitiveLoads: this.getRandomEnumValues<CognitiveLoad>(CognitiveLoad, 2),
      requiredAllianceStrengths: this.getRandomEnumValues<AllianceStrength>(AllianceStrength, 2),
      requiredConsentToDepth: faker.datatype.boolean() ? faker.datatype.boolean() : null,
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
      ...overrides,
    };
  }

  static createCounselTechniqueTransitionRulesNewProps(
    overrides: Partial<CounselTechniqueTransitionRulesNewProps> = {},
  ): CounselTechniqueTransitionRulesNewProps {
    const fromTechniqueId = new CounselTechniqueId();
    const toTechniqueId = new CounselTechniqueId();

    return {
      promptVersionId: new PromptVersionId(),
      fromCounselTechniqueId: fromTechniqueId,
      toCounselTechniqueId: toTechniqueId,
      priority: faker.number.int({ min: 0, max: 100 }),
      minCurrentTechniqueMessageCount: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 10 }) : null,
      maxCurrentTechniqueMessageCount: faker.datatype.boolean() ? faker.number.int({ min: 11, max: 20 }) : null,
      requiredImpactDomains: this.getRandomEnumValues<ImpactDomain>(ImpactDomain, 3),
      requiredTimeframes: this.getRandomEnumValues<Timeframe>(Timeframe, 2),
      requiredEmotionPrimaries: this.getRandomEnumValues<EmotionPrimary>(EmotionPrimary, 3),
      requiredValences: this.getRandomEnumValues<Valence>(Valence, 2),
      requiredArousalLevels: this.getRandomEnumValues<ArousalLevel>(ArousalLevel, 2),
      minEmotionIntensity: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null,
      maxEmotionIntensity: faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null,
      requiredPerceivedControls: this.getRandomEnumValues<PerceivedControl>(PerceivedControl, 2),
      requiredMotivationStages: this.getRandomEnumValues<MotivationStage>(MotivationStage, 3),
      minSelfEfficacy: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null,
      maxSelfEfficacy: faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null,
      requiredSocialSupportLevels: this.getRandomEnumValues<SocialSupportLevel>(SocialSupportLevel, 2),
      requiredRiskKinds: this.getRandomEnumValues<RiskKind>(RiskKind, 2),
      minRiskSeverity: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 1 }) : null,
      maxRiskSeverity: faker.datatype.boolean() ? faker.number.int({ min: 2, max: 3 }) : null,
      requiredSleepQualities: this.getRandomEnumValues<SleepQuality>(SleepQuality, 2),
      requiredPhysicalSymptomsPresent: faker.datatype.boolean() ? faker.datatype.boolean() : null,
      requiredCognitiveLoads: this.getRandomEnumValues<CognitiveLoad>(CognitiveLoad, 2),
      requiredAllianceStrengths: this.getRandomEnumValues<AllianceStrength>(AllianceStrength, 2),
      requiredConsentToDepth: faker.datatype.boolean() ? faker.datatype.boolean() : null,
      ...overrides,
    };
  }

  static createCounselTechniqueTransitionRules(
    overrides: Partial<CounselTechniqueTransitionRulesProps> = {},
  ): CounselTechniqueTransitionRules {
    const props = this.createCounselTechniqueTransitionRulesProps(overrides);
    const id = new CounselTechniqueTransitionRuleId();
    const result = CounselTechniqueTransitionRules.create(props, id);
    return result.value as CounselTechniqueTransitionRules;
  }

  static createCounselTechniqueTransitionRulesNew(
    overrides: Partial<CounselTechniqueTransitionRulesNewProps> = {},
  ): CounselTechniqueTransitionRules {
    const newProps = this.createCounselTechniqueTransitionRulesNewProps(overrides);
    const result = CounselTechniqueTransitionRules.createNew(newProps);
    return result.value as CounselTechniqueTransitionRules;
  }

  static createCounselTechniqueTransitionRuleInfo(
    overrides: Partial<CounselTechniqueTransitionRulesProps> = {},
  ): CounselTechniqueTransitionRuleInfo {
    const transitionRule = this.createCounselTechniqueTransitionRules(overrides);
    return CounselTechniqueTransitionRuleInfo.fromDomain(transitionRule);
  }

  static createCounselTechniqueTransitionRuleInfoArray(
    count: number,
    overrides: Partial<CounselTechniqueTransitionRulesProps> = {},
  ): CounselTechniqueTransitionRuleInfo[] {
    const transitionRules = Array.from({ length: count }, () => this.createCounselTechniqueTransitionRules(overrides));
    return CounselTechniqueTransitionRuleInfo.fromDomainArray(transitionRules);
  }

  static createCounselTechniqueTransitionRulesArray(
    count: number,
    overrides: Partial<CounselTechniqueTransitionRulesProps> = {},
  ): CounselTechniqueTransitionRules[] {
    return Array.from({ length: count }, () => this.createCounselTechniqueTransitionRules(overrides));
  }

  static createCounselTechniqueTransitionRuleEntity(
    overrides: Partial<CounselTechniqueTransitionRuleEntity> = {},
  ): CounselTechniqueTransitionRuleEntity {
    const entity = new CounselTechniqueTransitionRuleEntity();
    entity.id = new CounselTechniqueTransitionRuleId().getString();
    entity.promptVersionId = new PromptVersionId().getString();
    entity.fromCounselTechniqueId = new CounselTechniqueId().getString();
    entity.toCounselTechniqueId = new CounselTechniqueId().getString();
    entity.priority = faker.number.int({ min: 0, max: 100 });
    entity.minCurrentTechniqueMessageCount = faker.datatype.boolean() ? faker.number.int({ min: 1, max: 10 }) : null;
    entity.maxCurrentTechniqueMessageCount = faker.datatype.boolean() ? faker.number.int({ min: 11, max: 20 }) : null;
    entity.requiredImpactDomains = this.getRandomEnumValues<ImpactDomain>(ImpactDomain, 3);
    entity.requiredTimeframes = this.getRandomEnumValues<Timeframe>(Timeframe, 2);
    entity.requiredEmotionPrimaries = this.getRandomEnumValues<EmotionPrimary>(EmotionPrimary, 3);
    entity.requiredValences = this.getRandomEnumValues<Valence>(Valence, 2);
    entity.requiredArousalLevels = this.getRandomEnumValues<ArousalLevel>(ArousalLevel, 2);
    entity.minEmotionIntensity = faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null;
    entity.maxEmotionIntensity = faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null;
    entity.requiredPerceivedControls = this.getRandomEnumValues<PerceivedControl>(PerceivedControl, 2);
    entity.requiredMotivationStages = this.getRandomEnumValues<MotivationStage>(MotivationStage, 3);
    entity.minSelfEfficacy = faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null;
    entity.maxSelfEfficacy = faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null;
    entity.requiredSocialSupportLevels = this.getRandomEnumValues<SocialSupportLevel>(SocialSupportLevel, 2);
    entity.requiredRiskKinds = this.getRandomEnumValues<RiskKind>(RiskKind, 2);
    entity.minRiskSeverity = faker.datatype.boolean() ? faker.number.int({ min: 0, max: 1 }) : null;
    entity.maxRiskSeverity = faker.datatype.boolean() ? faker.number.int({ min: 2, max: 3 }) : null;
    entity.requiredSleepQualities = this.getRandomEnumValues<SleepQuality>(SleepQuality, 2);
    entity.requiredPhysicalSymptomsPresent = faker.datatype.boolean() ? faker.datatype.boolean() : null;
    entity.requiredCognitiveLoads = this.getRandomEnumValues<CognitiveLoad>(CognitiveLoad, 2);
    entity.requiredAllianceStrengths = this.getRandomEnumValues<AllianceStrength>(AllianceStrength, 2);
    entity.requiredConsentToDepth = faker.datatype.boolean() ? faker.datatype.boolean() : null;
    entity.createdAt = new Date().toISOString();
    entity.updatedAt = new Date().toISOString();
    entity.deletedAt = null;

    Object.assign(entity, overrides);
    return entity;
  }

  static createCounselTechniqueTransitionRuleEntityArray(
    count: number,
    overrides: Partial<CounselTechniqueTransitionRuleEntity> = {},
  ): CounselTechniqueTransitionRuleEntity[] {
    return Array.from({ length: count }, () => this.createCounselTechniqueTransitionRuleEntity(overrides));
  }
}
