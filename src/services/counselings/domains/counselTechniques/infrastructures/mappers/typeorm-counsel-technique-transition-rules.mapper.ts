import {
  CounselTechniqueTransitionRules,
  CounselTechniqueTransitionRulesProps,
} from "~counselings/domains/counselTechniques/models/counsel-technique-transition-rules";

import { HttpStatus } from "@nestjs/common";
import { EntityData } from "~common/shared/utils/orm";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import dayjs from "dayjs";

export class TypeormCounselTechniqueTransitionRulesMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselTechniqueTransitionRuleEntity): CounselTechniqueTransitionRules;
  static toDomain(entity: CounselTechniqueTransitionRuleEntity | null): CounselTechniqueTransitionRules | null;
  static toDomain(entity: CounselTechniqueTransitionRuleEntity | null): CounselTechniqueTransitionRules | null {
    if (!entity) {
      return null;
    }

    const props: CounselTechniqueTransitionRulesProps = {
      fromCounselTechniqueId: new CounselTechniqueId(entity.fromCounselTechniqueId),
      toCounselTechniqueId: new CounselTechniqueId(entity.toCounselTechniqueId),
      priority: entity.priority,
      minNotCompressedMessageCount: entity.minNotCompressedMessageCount,
      maxNotCompressedMessageCount: entity.maxNotCompressedMessageCount,
      minCurrentTechniqueMessageCount: entity.minCurrentTechniqueMessageCount,
      maxCurrentTechniqueMessageCount: entity.maxCurrentTechniqueMessageCount,
      requiredImpactDomains: entity.requiredImpactDomains,
      requiredTimeframes: entity.requiredTimeframes,
      requiredEmotionPrimaries: entity.requiredEmotionPrimaries,
      requiredValences: entity.requiredValences,
      requiredArousalLevels: entity.requiredArousalLevels,
      minEmotionIntensity: entity.minEmotionIntensity,
      maxEmotionIntensity: entity.maxEmotionIntensity,
      requiredPerceivedControls: entity.requiredPerceivedControls,
      requiredMotivationStages: entity.requiredMotivationStages,
      minSelfEfficacy: entity.minSelfEfficacy,
      maxSelfEfficacy: entity.maxSelfEfficacy,
      requiredSocialSupportLevels: entity.requiredSocialSupportLevels,
      requiredRiskKinds: entity.requiredRiskKinds,
      minRiskSeverity: entity.minRiskSeverity,
      maxRiskSeverity: entity.maxRiskSeverity,
      requiredSleepQualities: entity.requiredSleepQualities,
      requiredPhysicalSymptomsPresent: entity.requiredPhysicalSymptomsPresent,
      requiredCognitiveLoads: entity.requiredCognitiveLoads,
      requiredAllianceStrengths: entity.requiredAllianceStrengths,
      requiredConsentToDepth: entity.requiredConsentToDepth,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const transitionRuleOrError = CounselTechniqueTransitionRules.create(
      props,
      new CounselTechniqueTransitionRuleId(entity.id),
    );

    if (transitionRuleOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, transitionRuleOrError.errorValue);
    }

    return transitionRuleOrError.value;
  }

  static toDomains(entities: CounselTechniqueTransitionRuleEntity[]): CounselTechniqueTransitionRules[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(transitionRule: CounselTechniqueTransitionRules): CounselTechniqueTransitionRuleEntity {
    const entity = new CounselTechniqueTransitionRuleEntity();

    const mappedFields: EntityData<
      CounselTechniqueTransitionRuleEntity,
      "fromCounselTechnique" | "toCounselTechnique"
    > = {
      id: transitionRule.id.getString(),
      fromCounselTechniqueId: transitionRule.fromCounselTechniqueId.getString(),
      toCounselTechniqueId: transitionRule.toCounselTechniqueId.getString(),
      priority: transitionRule.priority,
      minNotCompressedMessageCount: transitionRule.minNotCompressedMessageCount,
      maxNotCompressedMessageCount: transitionRule.maxNotCompressedMessageCount,
      minCurrentTechniqueMessageCount: transitionRule.minCurrentTechniqueMessageCount,
      maxCurrentTechniqueMessageCount: transitionRule.maxCurrentTechniqueMessageCount,
      requiredImpactDomains: transitionRule.requiredImpactDomains,
      requiredTimeframes: transitionRule.requiredTimeframes,
      requiredEmotionPrimaries: transitionRule.requiredEmotionPrimaries,
      requiredValences: transitionRule.requiredValences,
      requiredArousalLevels: transitionRule.requiredArousalLevels,
      minEmotionIntensity: transitionRule.minEmotionIntensity,
      maxEmotionIntensity: transitionRule.maxEmotionIntensity,
      requiredPerceivedControls: transitionRule.requiredPerceivedControls,
      requiredMotivationStages: transitionRule.requiredMotivationStages,
      minSelfEfficacy: transitionRule.minSelfEfficacy,
      maxSelfEfficacy: transitionRule.maxSelfEfficacy,
      requiredSocialSupportLevels: transitionRule.requiredSocialSupportLevels,
      requiredRiskKinds: transitionRule.requiredRiskKinds,
      minRiskSeverity: transitionRule.minRiskSeverity,
      maxRiskSeverity: transitionRule.maxRiskSeverity,
      requiredSleepQualities: transitionRule.requiredSleepQualities,
      requiredPhysicalSymptomsPresent: transitionRule.requiredPhysicalSymptomsPresent,
      requiredCognitiveLoads: transitionRule.requiredCognitiveLoads,
      requiredAllianceStrengths: transitionRule.requiredAllianceStrengths,
      requiredConsentToDepth: transitionRule.requiredConsentToDepth,
      createdAt: transitionRule.createdAt.toISOString(),
      updatedAt: transitionRule.updatedAt.toISOString(),
      deletedAt: transitionRule.deletedAt?.toISOString() ?? null,
    };

    Object.assign(entity, mappedFields);

    return entity;
  }

  static toEntities(transitionRules: CounselTechniqueTransitionRules[]): CounselTechniqueTransitionRuleEntity[] {
    return transitionRules?.map((transitionRule) => this.toEntity(transitionRule)) ?? [];
  }
}
