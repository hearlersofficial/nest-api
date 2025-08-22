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

import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { Dayjs } from "dayjs";

export interface CounselTechniqueTransitionRulesNewProps {
  promptVersionId: PromptVersionId;
  fromCounselTechniqueId: CounselTechniqueId;
  toCounselTechniqueId: CounselTechniqueId;
  priority: number;

  // 메시지 수 관련 조건
  minNotCompressedMessageCount: number | null;
  maxNotCompressedMessageCount: number | null;
  minCurrentTechniqueMessageCount: number | null;
  maxCurrentTechniqueMessageCount: number | null;

  // 삶의 영역 및 시간 관련 조건
  requiredImpactDomains: ImpactDomain[];
  requiredTimeframes: Timeframe[];

  // 감정 관련 조건
  requiredEmotionPrimaries: EmotionPrimary[];
  requiredValences: Valence[];
  requiredArousalLevels: ArousalLevel[];
  minEmotionIntensity: number | null;
  maxEmotionIntensity: number | null;

  // 통제감 및 동기 관련 조건
  requiredPerceivedControls: PerceivedControl[];
  requiredMotivationStages: MotivationStage[];
  minSelfEfficacy: number | null;
  maxSelfEfficacy: number | null;

  // 사회적 지지 관련 조건
  requiredSocialSupportLevels: SocialSupportLevel[];

  // 위험 관련 조건
  requiredRiskKinds: RiskKind[];
  minRiskSeverity: number | null;
  maxRiskSeverity: number | null;

  // 수면 및 신체 증상 관련 조건
  requiredSleepQualities: SleepQuality[];
  requiredPhysicalSymptomsPresent: boolean | null;

  // 인지 부하 관련 조건
  requiredCognitiveLoads: CognitiveLoad[];

  // 동맹 관련 조건
  requiredAllianceStrengths: AllianceStrength[];

  // 심층 동의 관련 조건
  requiredConsentToDepth: boolean | null;
}

export interface CounselTechniqueTransitionRulesProps extends CounselTechniqueTransitionRulesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CounselTechniqueTransitionRules extends DomainEntity<
  CounselTechniqueTransitionRulesProps,
  CounselTechniqueTransitionRuleId
> {
  private constructor(props: CounselTechniqueTransitionRulesProps, id: CounselTechniqueTransitionRuleId) {
    super(props, id);
  }

  public static create(
    props: CounselTechniqueTransitionRulesProps,
    id: CounselTechniqueTransitionRuleId,
  ): Result<CounselTechniqueTransitionRules> {
    const transitionRule = new CounselTechniqueTransitionRules(props, id);
    const result = transitionRule.validateDomain();
    if (result.isFailureResult()) {
      return Result.fail(result.error);
    }
    return Result.ok<CounselTechniqueTransitionRules>(transitionRule);
  }

  public static createNew(newProps: CounselTechniqueTransitionRulesNewProps): Result<CounselTechniqueTransitionRules> {
    const now = getNowDayjs();
    const newId = new CounselTechniqueTransitionRuleId();
    return this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }

  public validateDomain(): Result<void> {
    if (!isDefined(this.props.fromCounselTechniqueId)) {
      return Result.fail("[CounselTechniqueTransitionRule] 출발 상담 기법 ID는 필수입니다");
    }
    if (!isDefined(this.props.toCounselTechniqueId)) {
      return Result.fail("[CounselTechniqueTransitionRule] 도착 상담 기법 ID는 필수입니다");
    }
    if (this.props.fromCounselTechniqueId.equals(this.props.toCounselTechniqueId)) {
      return Result.fail("[CounselTechniqueTransitionRule] 출발 기법과 도착 기법은 달라야 합니다");
    }
    if (this.props.priority < 0 || !Number.isInteger(this.props.priority)) {
      return Result.fail("[CounselTechniqueTransitionRule] 우선순위는 0 이상의 정수여야 합니다");
    }

    // 범위 유효성 검사
    if (
      isDefined(this.props.minNotCompressedMessageCount) &&
      isDefined(this.props.maxNotCompressedMessageCount) &&
      this.props.minNotCompressedMessageCount > this.props.maxNotCompressedMessageCount
    ) {
      return Result.fail(
        "[CounselTechniqueTransitionRule] 최소 압축되지 않은 메시지 수는 최대값보다 작거나 같아야 합니다",
      );
    }

    if (
      isDefined(this.props.minCurrentTechniqueMessageCount) &&
      isDefined(this.props.maxCurrentTechniqueMessageCount) &&
      this.props.minCurrentTechniqueMessageCount > this.props.maxCurrentTechniqueMessageCount
    ) {
      return Result.fail("[CounselTechniqueTransitionRule] 최소 현 기법 메시지 수는 최대값보다 작거나 같아야 합니다");
    }

    if (
      isDefined(this.props.minEmotionIntensity) &&
      (this.props.minEmotionIntensity < 0 || this.props.minEmotionIntensity > 10)
    ) {
      return Result.fail("[CounselTechniqueTransitionRule] 최소 감정 강도는 0~10 사이여야 합니다");
    }

    if (
      isDefined(this.props.maxEmotionIntensity) &&
      (this.props.maxEmotionIntensity < 0 || this.props.maxEmotionIntensity > 10)
    ) {
      return Result.fail("[CounselTechniqueTransitionRule] 최대 감정 강도는 0~10 사이여야 합니다");
    }

    if (
      isDefined(this.props.minEmotionIntensity) &&
      isDefined(this.props.maxEmotionIntensity) &&
      this.props.minEmotionIntensity > this.props.maxEmotionIntensity
    ) {
      return Result.fail("[CounselTechniqueTransitionRule] 최소 감정 강도는 최대값보다 작거나 같아야 합니다");
    }

    if (isDefined(this.props.minSelfEfficacy) && (this.props.minSelfEfficacy < 0 || this.props.minSelfEfficacy > 10)) {
      return Result.fail("[CounselTechniqueTransitionRule] 최소 자기효능감은 0~10 사이여야 합니다");
    }

    if (isDefined(this.props.maxSelfEfficacy) && (this.props.maxSelfEfficacy < 0 || this.props.maxSelfEfficacy > 10)) {
      return Result.fail("[CounselTechniqueTransitionRule] 최대 자기효능감은 0~10 사이여야 합니다");
    }

    if (
      isDefined(this.props.minSelfEfficacy) &&
      isDefined(this.props.maxSelfEfficacy) &&
      this.props.minSelfEfficacy > this.props.maxSelfEfficacy
    ) {
      return Result.fail("[CounselTechniqueTransitionRule] 최소 자기효능감은 최대값보다 작거나 같아야 합니다");
    }

    if (isDefined(this.props.minRiskSeverity) && (this.props.minRiskSeverity < 0 || this.props.minRiskSeverity > 3)) {
      return Result.fail("[CounselTechniqueTransitionRule] 최소 위험 심각도는 0~3 사이여야 합니다");
    }

    if (isDefined(this.props.maxRiskSeverity) && (this.props.maxRiskSeverity < 0 || this.props.maxRiskSeverity > 3)) {
      return Result.fail("[CounselTechniqueTransitionRule] 최대 위험 심각도는 0~3 사이여야 합니다");
    }

    if (
      isDefined(this.props.minRiskSeverity) &&
      isDefined(this.props.maxRiskSeverity) &&
      this.props.minRiskSeverity > this.props.maxRiskSeverity
    ) {
      return Result.fail("[CounselTechniqueTransitionRule] 최소 위험 심각도는 최대값보다 작거나 같아야 합니다");
    }

    return Result.ok();
  }

  public update(
    updates: Partial<
      Omit<CounselTechniqueTransitionRulesProps, "promptVersionId" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ): void {
    const now = getNowDayjs();
    const assignIfDefined = this.createAssignIfDefined(updates);

    assignIfDefined("priority");
    assignIfDefined("minNotCompressedMessageCount");
    assignIfDefined("maxNotCompressedMessageCount");
    assignIfDefined("minCurrentTechniqueMessageCount");
    assignIfDefined("maxCurrentTechniqueMessageCount");
    assignIfDefined("requiredImpactDomains");
    assignIfDefined("requiredTimeframes");
    assignIfDefined("requiredEmotionPrimaries");
    assignIfDefined("requiredValences");
    assignIfDefined("requiredArousalLevels");
    assignIfDefined("minEmotionIntensity");
    assignIfDefined("maxEmotionIntensity");
    assignIfDefined("requiredPerceivedControls");
    assignIfDefined("requiredMotivationStages");
    assignIfDefined("minSelfEfficacy");
    assignIfDefined("maxSelfEfficacy");
    assignIfDefined("requiredSocialSupportLevels");
    assignIfDefined("requiredRiskKinds");
    assignIfDefined("minRiskSeverity");
    assignIfDefined("maxRiskSeverity");
    assignIfDefined("requiredSleepQualities");
    assignIfDefined("requiredPhysicalSymptomsPresent");
    assignIfDefined("requiredCognitiveLoads");
    assignIfDefined("requiredAllianceStrengths");
    assignIfDefined("requiredConsentToDepth");

    this.props.updatedAt = now;
  }

  public delete(): void {
    this.props.updatedAt = getNowDayjs();
    this.props.deletedAt = getNowDayjs();
  }

  // Getters
  get promptVersionId(): PromptVersionId {
    return this.props.promptVersionId;
  }

  get fromCounselTechniqueId(): CounselTechniqueId {
    return this.props.fromCounselTechniqueId;
  }

  get toCounselTechniqueId(): CounselTechniqueId {
    return this.props.toCounselTechniqueId;
  }

  get priority(): number {
    return this.props.priority;
  }

  get minNotCompressedMessageCount(): number | null {
    return this.props.minNotCompressedMessageCount;
  }

  get maxNotCompressedMessageCount(): number | null {
    return this.props.maxNotCompressedMessageCount;
  }

  get minCurrentTechniqueMessageCount(): number | null {
    return this.props.minCurrentTechniqueMessageCount;
  }

  get maxCurrentTechniqueMessageCount(): number | null {
    return this.props.maxCurrentTechniqueMessageCount;
  }

  get requiredImpactDomains(): ImpactDomain[] {
    return this.props.requiredImpactDomains;
  }

  get requiredTimeframes(): Timeframe[] {
    return this.props.requiredTimeframes;
  }

  get requiredEmotionPrimaries(): EmotionPrimary[] {
    return this.props.requiredEmotionPrimaries;
  }

  get requiredValences(): Valence[] {
    return this.props.requiredValences;
  }

  get requiredArousalLevels(): ArousalLevel[] {
    return this.props.requiredArousalLevels;
  }

  get minEmotionIntensity(): number | null {
    return this.props.minEmotionIntensity;
  }

  get maxEmotionIntensity(): number | null {
    return this.props.maxEmotionIntensity;
  }

  get requiredPerceivedControls(): PerceivedControl[] {
    return this.props.requiredPerceivedControls;
  }

  get requiredMotivationStages(): MotivationStage[] {
    return this.props.requiredMotivationStages;
  }

  get minSelfEfficacy(): number | null {
    return this.props.minSelfEfficacy;
  }

  get maxSelfEfficacy(): number | null {
    return this.props.maxSelfEfficacy;
  }

  get requiredSocialSupportLevels(): SocialSupportLevel[] {
    return this.props.requiredSocialSupportLevels;
  }

  get requiredRiskKinds(): RiskKind[] {
    return this.props.requiredRiskKinds;
  }

  get minRiskSeverity(): number | null {
    return this.props.minRiskSeverity;
  }

  get maxRiskSeverity(): number | null {
    return this.props.maxRiskSeverity;
  }

  get requiredSleepQualities(): SleepQuality[] {
    return this.props.requiredSleepQualities;
  }

  get requiredPhysicalSymptomsPresent(): boolean | null {
    return this.props.requiredPhysicalSymptomsPresent;
  }

  get requiredCognitiveLoads(): CognitiveLoad[] {
    return this.props.requiredCognitiveLoads;
  }

  get requiredAllianceStrengths(): AllianceStrength[] {
    return this.props.requiredAllianceStrengths;
  }

  get requiredConsentToDepth(): boolean | null {
    return this.props.requiredConsentToDepth;
  }

  get createdAt(): Dayjs {
    return this.props.createdAt;
  }

  get updatedAt(): Dayjs {
    return this.props.updatedAt;
  }

  get deletedAt(): Dayjs | null {
    return this.props.deletedAt;
  }
}
