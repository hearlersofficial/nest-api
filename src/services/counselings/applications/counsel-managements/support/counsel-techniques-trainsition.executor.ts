import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { CounselTechniquesService } from "~counselings/domains/counsel-techniques/counsel-techniques.service";
import { CounselTechniqueTransitionRuleInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rule.info";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselContextsInfo } from "~counselings/domains/counsels/models/counsel-contexts.info";

import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class CounselTechniquesTransitionExecutor {
  constructor(
    private readonly counselTechniquesService: CounselTechniquesService,
    private readonly counselsService: CounselsService,
  ) {}

  private readonly logger = new Logger(CounselTechniquesTransitionExecutor.name);

  async executeTransitionBackgroundIfPossible(counselSession: CounselSession): Promise<void> {
    Promise.resolve()
      .then(async () => {
        const matchingRule = await this.evaluateTransition(counselSession);
        if (matchingRule) {
          await this.counselsService.updateCounselTechniqueId({
            counselId: counselSession.counselId,
            counselTechniqueId: matchingRule.toCounselTechniqueId,
          });
        }
      })
      .catch((error) => {
        this.logger.error(
          `[CounselTechniquesTransitionExecutor] executeTransitionBackgroundIfPossible failed: ${counselSession.counselId}`,
          error,
        );
      });
  }

  private async evaluateTransition(counselSession: CounselSession): Promise<CounselTechniqueTransitionRuleInfo | null> {
    const counselTechniqueTransitionRules = await this.counselTechniquesService.findManyTransitionRules({
      promptVersionId: counselSession.promptVersion.id,
      fromCounselTechniqueId: counselSession.currentTechnique.id,
    });

    if (!counselTechniqueTransitionRules || counselTechniqueTransitionRules.length === 0) {
      return null;
    }
    // 현재 세션 컨텍스트 정보 추출
    const currentContext = counselSession.counsel.context;
    const currentTechniqueMessageCount = currentContext.currentTechniqueMessageCount;

    // 조건을 만족하는 규칙들을 필터링하고 최고 우선순위 규칙 반환
    const matchingRule = this.findHighestPriorityMatchingRule(
      counselTechniqueTransitionRules,
      currentContext,
      currentTechniqueMessageCount,
    );

    return matchingRule;
  }

  private findHighestPriorityMatchingRule(
    transitionRules: CounselTechniqueTransitionRuleInfo[],
    currentContext: CounselContextsInfo,
    currentTechniqueMessageCount: number,
  ): CounselTechniqueTransitionRuleInfo | null {
    let highestPriorityRule: CounselTechniqueTransitionRuleInfo | null = null;
    let highestPriority = -1;

    for (const rule of transitionRules) {
      // 기본 조건 검증 (빠른 실패를 위한 early return)
      if (!this.isBasicConditionMet(rule, currentTechniqueMessageCount)) {
        continue;
      }

      // 컨텍스트 조건 검증
      if (!this.isContextConditionMet(rule, currentContext)) {
        continue;
      }

      // 우선순위가 더 높은 규칙인지 확인
      if (rule.priority > highestPriority) {
        highestPriority = rule.priority;
        highestPriorityRule = rule;
      }
    }

    return highestPriorityRule;
  }

  private isBasicConditionMet(rule: CounselTechniqueTransitionRuleInfo, currentTechniqueMessageCount: number): boolean {
    if (
      rule.minCurrentTechniqueMessageCount !== null &&
      currentTechniqueMessageCount < rule.minCurrentTechniqueMessageCount
    ) {
      return false;
    }
    if (
      rule.maxCurrentTechniqueMessageCount !== null &&
      currentTechniqueMessageCount > rule.maxCurrentTechniqueMessageCount
    ) {
      return false;
    }
    return true;
  }

  private isContextConditionMet(
    rule: CounselTechniqueTransitionRuleInfo,
    currentContext: CounselContextsInfo,
  ): boolean {
    // 배열 조건 검증 (빈 배열이면 모든 값 허용)
    if (rule.requiredImpactDomains.length > 0 && !rule.requiredImpactDomains.includes(currentContext.impactDomain)) {
      return false;
    }
    if (rule.requiredTimeframes.length > 0 && !rule.requiredTimeframes.includes(currentContext.timeframe)) {
      return false;
    }
    if (
      rule.requiredEmotionPrimaries.length > 0 &&
      !rule.requiredEmotionPrimaries.includes(currentContext.emotionPrimary)
    ) {
      return false;
    }
    if (rule.requiredValences.length > 0 && !rule.requiredValences.includes(currentContext.valence)) {
      return false;
    }
    if (rule.requiredArousalLevels.length > 0 && !rule.requiredArousalLevels.includes(currentContext.arousal)) {
      return false;
    }
    if (
      rule.requiredPerceivedControls.length > 0 &&
      !rule.requiredPerceivedControls.includes(currentContext.perceivedControl)
    ) {
      return false;
    }
    if (
      rule.requiredMotivationStages.length > 0 &&
      !rule.requiredMotivationStages.includes(currentContext.motivationStage)
    ) {
      return false;
    }
    if (
      rule.requiredSocialSupportLevels.length > 0 &&
      !rule.requiredSocialSupportLevels.includes(currentContext.socialSupport)
    ) {
      return false;
    }
    if (rule.requiredRiskKinds.length > 0 && !rule.requiredRiskKinds.includes(currentContext.riskKind)) {
      return false;
    }
    if (rule.requiredSleepQualities.length > 0 && !rule.requiredSleepQualities.includes(currentContext.sleepQuality)) {
      return false;
    }
    if (rule.requiredCognitiveLoads.length > 0 && !rule.requiredCognitiveLoads.includes(currentContext.cognitiveLoad)) {
      return false;
    }
    if (
      rule.requiredAllianceStrengths.length > 0 &&
      !rule.requiredAllianceStrengths.includes(currentContext.allianceStrength)
    ) {
      return false;
    }

    // 범위 조건 검증
    if (
      rule.minEmotionIntensity !== null &&
      currentContext.emotionIntensity !== null &&
      currentContext.emotionIntensity < rule.minEmotionIntensity
    ) {
      return false;
    }
    if (
      rule.maxEmotionIntensity !== null &&
      currentContext.emotionIntensity !== null &&
      currentContext.emotionIntensity > rule.maxEmotionIntensity
    ) {
      return false;
    }
    if (
      rule.minSelfEfficacy !== null &&
      currentContext.selfEfficacy !== null &&
      currentContext.selfEfficacy < rule.minSelfEfficacy
    ) {
      return false;
    }
    if (
      rule.maxSelfEfficacy !== null &&
      currentContext.selfEfficacy !== null &&
      currentContext.selfEfficacy > rule.maxSelfEfficacy
    ) {
      return false;
    }
    if (
      rule.minRiskSeverity !== null &&
      currentContext.riskSeverity !== null &&
      currentContext.riskSeverity < rule.minRiskSeverity
    ) {
      return false;
    }
    if (
      rule.maxRiskSeverity !== null &&
      currentContext.riskSeverity !== null &&
      currentContext.riskSeverity > rule.maxRiskSeverity
    ) {
      return false;
    }

    // boolean 조건 검증
    if (
      rule.requiredPhysicalSymptomsPresent !== null &&
      currentContext.physicalSymptomsPresent !== rule.requiredPhysicalSymptomsPresent
    ) {
      return false;
    }
    if (rule.requiredConsentToDepth !== null && currentContext.consentToDepth !== rule.requiredConsentToDepth) {
      return false;
    }

    return true;
  }
}
