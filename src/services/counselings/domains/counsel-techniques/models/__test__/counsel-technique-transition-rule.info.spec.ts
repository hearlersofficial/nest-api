import { CounselTechniqueTransitionRuleInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rule.info";

import { CounselTechniqueTransitionRulesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-technique-transition-rules.helper";

describe("CounselTechniqueTransitionRuleInfo", () => {
  describe("fromDomain", () => {
    it("CounselTechniqueTransitionRules 도메인 객체로부터 CounselTechniqueTransitionRuleInfo를 생성할 수 있다", () => {
      const transitionRule = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();
      const transitionRuleInfo = CounselTechniqueTransitionRuleInfo.fromDomain(transitionRule);

      expect(transitionRuleInfo.id).toEqual(transitionRule.id);
      expect(transitionRuleInfo.promptVersionId).toEqual(transitionRule.promptVersionId);
      expect(transitionRuleInfo.fromCounselTechniqueId).toEqual(transitionRule.fromCounselTechniqueId);
      expect(transitionRuleInfo.toCounselTechniqueId).toEqual(transitionRule.toCounselTechniqueId);
      expect(transitionRuleInfo.priority).toBe(transitionRule.priority);
      expect(transitionRuleInfo.minCurrentTechniqueMessageCount).toBe(transitionRule.minCurrentTechniqueMessageCount);
      expect(transitionRuleInfo.maxCurrentTechniqueMessageCount).toBe(transitionRule.maxCurrentTechniqueMessageCount);
      expect(transitionRuleInfo.requiredImpactDomains).toEqual(transitionRule.requiredImpactDomains);
      expect(transitionRuleInfo.requiredTimeframes).toEqual(transitionRule.requiredTimeframes);
      expect(transitionRuleInfo.requiredEmotionPrimaries).toEqual(transitionRule.requiredEmotionPrimaries);
      expect(transitionRuleInfo.requiredValences).toEqual(transitionRule.requiredValences);
      expect(transitionRuleInfo.requiredArousalLevels).toEqual(transitionRule.requiredArousalLevels);
      expect(transitionRuleInfo.minEmotionIntensity).toBe(transitionRule.minEmotionIntensity);
      expect(transitionRuleInfo.maxEmotionIntensity).toBe(transitionRule.maxEmotionIntensity);
      expect(transitionRuleInfo.requiredPerceivedControls).toEqual(transitionRule.requiredPerceivedControls);
      expect(transitionRuleInfo.requiredMotivationStages).toEqual(transitionRule.requiredMotivationStages);
      expect(transitionRuleInfo.minSelfEfficacy).toBe(transitionRule.minSelfEfficacy);
      expect(transitionRuleInfo.maxSelfEfficacy).toBe(transitionRule.maxSelfEfficacy);
      expect(transitionRuleInfo.requiredSocialSupportLevels).toEqual(transitionRule.requiredSocialSupportLevels);
      expect(transitionRuleInfo.requiredRiskKinds).toEqual(transitionRule.requiredRiskKinds);
      expect(transitionRuleInfo.minRiskSeverity).toBe(transitionRule.minRiskSeverity);
      expect(transitionRuleInfo.maxRiskSeverity).toBe(transitionRule.maxRiskSeverity);
      expect(transitionRuleInfo.requiredSleepQualities).toEqual(transitionRule.requiredSleepQualities);
      expect(transitionRuleInfo.requiredPhysicalSymptomsPresent).toBe(transitionRule.requiredPhysicalSymptomsPresent);
      expect(transitionRuleInfo.requiredCognitiveLoads).toEqual(transitionRule.requiredCognitiveLoads);
      expect(transitionRuleInfo.requiredAllianceStrengths).toEqual(transitionRule.requiredAllianceStrengths);
      expect(transitionRuleInfo.requiredConsentToDepth).toBe(transitionRule.requiredConsentToDepth);
      expect(transitionRuleInfo.createdAt).toEqual(transitionRule.createdAt);
      expect(transitionRuleInfo.updatedAt).toEqual(transitionRule.updatedAt);
      expect(transitionRuleInfo.deletedAt).toBeNull();
    });
  });

  describe("fromDomainArray", () => {
    it("CounselTechniqueTransitionRules 도메인 객체 배열로부터 CounselTechniqueTransitionRuleInfo 배열을 생성할 수 있다", () => {
      const transitionRules = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(3);
      const transitionRuleInfos = CounselTechniqueTransitionRuleInfo.fromDomainArray(transitionRules);

      expect(transitionRuleInfos).toHaveLength(3);
      expect(transitionRuleInfos[0].id).toEqual(transitionRules[0].id);
      expect(transitionRuleInfos[1].id).toEqual(transitionRules[1].id);
      expect(transitionRuleInfos[2].id).toEqual(transitionRules[2].id);
    });

    it("빈 배열에 대해서도 올바르게 처리한다", () => {
      const transitionRuleInfos = CounselTechniqueTransitionRuleInfo.fromDomainArray([]);

      expect(transitionRuleInfos).toHaveLength(0);
    });
  });

  describe("constructor", () => {
    it("모든 속성이 올바르게 설정된다", () => {
      const transitionRule = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();
      const transitionRuleInfo = new CounselTechniqueTransitionRuleInfo(
        transitionRule.id,
        transitionRule.promptVersionId,
        transitionRule.fromCounselTechniqueId,
        transitionRule.toCounselTechniqueId,
        transitionRule.priority,
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

      expect(transitionRuleInfo.id).toEqual(transitionRule.id);
      expect(transitionRuleInfo.promptVersionId).toEqual(transitionRule.promptVersionId);
      expect(transitionRuleInfo.fromCounselTechniqueId).toEqual(transitionRule.fromCounselTechniqueId);
      expect(transitionRuleInfo.toCounselTechniqueId).toEqual(transitionRule.toCounselTechniqueId);
      expect(transitionRuleInfo.priority).toBe(transitionRule.priority);
      expect(transitionRuleInfo.minCurrentTechniqueMessageCount).toBe(transitionRule.minCurrentTechniqueMessageCount);
      expect(transitionRuleInfo.maxCurrentTechniqueMessageCount).toBe(transitionRule.maxCurrentTechniqueMessageCount);
      expect(transitionRuleInfo.requiredImpactDomains).toEqual(transitionRule.requiredImpactDomains);
      expect(transitionRuleInfo.requiredTimeframes).toEqual(transitionRule.requiredTimeframes);
      expect(transitionRuleInfo.requiredEmotionPrimaries).toEqual(transitionRule.requiredEmotionPrimaries);
      expect(transitionRuleInfo.requiredValences).toEqual(transitionRule.requiredValences);
      expect(transitionRuleInfo.requiredArousalLevels).toEqual(transitionRule.requiredArousalLevels);
      expect(transitionRuleInfo.minEmotionIntensity).toBe(transitionRule.minEmotionIntensity);
      expect(transitionRuleInfo.maxEmotionIntensity).toBe(transitionRule.maxEmotionIntensity);
      expect(transitionRuleInfo.requiredPerceivedControls).toEqual(transitionRule.requiredPerceivedControls);
      expect(transitionRuleInfo.requiredMotivationStages).toEqual(transitionRule.requiredMotivationStages);
      expect(transitionRuleInfo.minSelfEfficacy).toBe(transitionRule.minSelfEfficacy);
      expect(transitionRuleInfo.maxSelfEfficacy).toBe(transitionRule.maxSelfEfficacy);
      expect(transitionRuleInfo.requiredSocialSupportLevels).toEqual(transitionRule.requiredSocialSupportLevels);
      expect(transitionRuleInfo.requiredRiskKinds).toEqual(transitionRule.requiredRiskKinds);
      expect(transitionRuleInfo.minRiskSeverity).toBe(transitionRule.minRiskSeverity);
      expect(transitionRuleInfo.maxRiskSeverity).toBe(transitionRule.maxRiskSeverity);
      expect(transitionRuleInfo.requiredSleepQualities).toEqual(transitionRule.requiredSleepQualities);
      expect(transitionRuleInfo.requiredPhysicalSymptomsPresent).toBe(transitionRule.requiredPhysicalSymptomsPresent);
      expect(transitionRuleInfo.requiredCognitiveLoads).toEqual(transitionRule.requiredCognitiveLoads);
      expect(transitionRuleInfo.requiredAllianceStrengths).toEqual(transitionRule.requiredAllianceStrengths);
      expect(transitionRuleInfo.requiredConsentToDepth).toBe(transitionRule.requiredConsentToDepth);
      expect(transitionRuleInfo.createdAt).toEqual(transitionRule.createdAt);
      expect(transitionRuleInfo.updatedAt).toEqual(transitionRule.updatedAt);
      expect(transitionRuleInfo.deletedAt).toBeNull();
    });
  });
});
