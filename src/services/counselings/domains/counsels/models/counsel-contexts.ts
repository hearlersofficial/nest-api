import {
  ALLIANCE_STRENGTH_DESCRIPTIONS,
  AROUSAL_LEVEL_DESCRIPTIONS,
  COGNITIVE_LOAD_DESCRIPTIONS,
  EMOTION_PRIMARY_DESCRIPTIONS,
  IMPACT_DOMAIN_DESCRIPTIONS,
  MOTIVATION_STAGE_DESCRIPTIONS,
  PERCEIVED_CONTROL_DESCRIPTIONS,
  RISK_KIND_DESCRIPTIONS,
  SLEEP_QUALITY_DESCRIPTIONS,
  SOCIAL_SUPPORT_LEVEL_DESCRIPTIONS,
  TIMEFRAME_DESCRIPTIONS,
  VALENCE_DESCRIPTIONS,
} from "~counselings/domains/counsels/models/enum-descriptions";
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
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselContextId } from "~common/shared-kernel/identifiers/counsel-context.id";
import { Dayjs } from "dayjs";

export interface CounselContextsNewProps {
  counselId: CounselId;
}

export interface CounselContextsProps extends CounselContextsNewProps {
  notCompressedMessageCount: number;
  lastMessageCompressedAt: Dayjs | null;
  currentTechniqueMessageCount: number;
  impactDomain: ImpactDomain;
  timeframe: Timeframe;
  emotionPrimary: EmotionPrimary;
  valence: Valence;
  arousal: ArousalLevel;
  perceivedControl: PerceivedControl;
  motivationStage: MotivationStage;
  socialSupport: SocialSupportLevel;
  riskKind: RiskKind;
  sleepQuality: SleepQuality;
  cognitiveLoad: CognitiveLoad;
  allianceStrength: AllianceStrength;
  riskSeverity: 0 | 1 | 2 | 3 | null;
  selfEfficacy: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null;
  emotionIntensity: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null;
  physicalSymptomsPresent: boolean | null;
  consentToDepth: boolean | null;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CounselContexts extends DomainEntity<CounselContextsProps, CounselContextId> {
  public static readonly COMPRESSION_THRESHOLD = 20;

  private constructor(props: CounselContextsProps, id: CounselContextId) {
    super(props, id);
  }

  public static create(props: CounselContextsProps, id: CounselContextId): Result<CounselContexts> {
    const counselContexts = new CounselContexts(props, id);
    const result = counselContexts.validateDomain();
    if (result.isFailureResult()) {
      return Result.fail(result.error);
    }
    return Result.ok<CounselContexts>(counselContexts);
  }

  public static createNew(newProps: CounselContextsNewProps): Result<CounselContexts> {
    const now = getNowDayjs();
    const newId = new CounselContextId();
    return this.create(
      {
        ...newProps,
        notCompressedMessageCount: 0,
        lastMessageCompressedAt: null,
        currentTechniqueMessageCount: 0,
        impactDomain: ImpactDomain.UNSPECIFIED,
        timeframe: Timeframe.UNSPECIFIED,
        emotionPrimary: EmotionPrimary.UNSPECIFIED,
        valence: Valence.UNSPECIFIED,
        arousal: ArousalLevel.UNSPECIFIED,
        perceivedControl: PerceivedControl.UNSPECIFIED,
        motivationStage: MotivationStage.UNSPECIFIED,
        socialSupport: SocialSupportLevel.UNSPECIFIED,
        riskKind: RiskKind.UNSPECIFIED,
        sleepQuality: SleepQuality.UNSPECIFIED,
        cognitiveLoad: CognitiveLoad.UNSPECIFIED,
        allianceStrength: AllianceStrength.UNSPECIFIED,
        riskSeverity: null,
        selfEfficacy: null,
        emotionIntensity: null,
        physicalSymptomsPresent: null,
        consentToDepth: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }
  public validateDomain(): Result<void> {
    if (this.props.currentTechniqueMessageCount < 0) {
      return Result.fail("[CounselContexts] 현 기법에서 누적 메시지 수는 0 이상이어야 합니다");
    }
    if (
      isDefined(this.props.emotionIntensity) &&
      (this.props.emotionIntensity < 0 ||
        this.props.emotionIntensity > 10 ||
        !Number.isInteger(this.props.emotionIntensity))
    ) {
      return Result.fail("[CounselContexts] 감정 강도는 0~10 사이 정수여야 합니다");
    }
    if (
      isDefined(this.props.selfEfficacy) &&
      (this.props.selfEfficacy < 0 || this.props.selfEfficacy > 10 || !Number.isInteger(this.props.selfEfficacy))
    ) {
      return Result.fail("[CounselContexts] 자기효능감은 0~10 사이 정수여야 합니다");
    }
    if (
      isDefined(this.props.riskSeverity) &&
      (this.props.riskSeverity < 0 || this.props.riskSeverity > 3 || !Number.isInteger(this.props.riskSeverity))
    ) {
      return Result.fail("[CounselContexts] 위험 심각도는 0~3 사이 정수여야 합니다");
    }
    if (!isDefined(this.props.counselId)) {
      return Result.fail("[CounselContexts] 상담 ID는 필수입니다");
    }
    return Result.ok();
  }

  public static getEnumOverview(enumType: typeof ImpactDomain): string;
  public static getEnumOverview(enumType: typeof Timeframe): string;
  public static getEnumOverview(enumType: typeof EmotionPrimary): string;
  public static getEnumOverview(enumType: typeof Valence): string;
  public static getEnumOverview(enumType: typeof ArousalLevel): string;
  public static getEnumOverview(enumType: typeof PerceivedControl): string;
  public static getEnumOverview(enumType: typeof MotivationStage): string;
  public static getEnumOverview(enumType: typeof SocialSupportLevel): string;
  public static getEnumOverview(enumType: typeof RiskKind): string;
  public static getEnumOverview(enumType: typeof SleepQuality): string;
  public static getEnumOverview(enumType: typeof CognitiveLoad): string;
  public static getEnumOverview(enumType: typeof AllianceStrength): string;
  public static getEnumOverview(enumType: any): string {
    if (enumType === ImpactDomain) {
      return this.buildEnumBlock("IMPACT_DOMAIN", ImpactDomain, IMPACT_DOMAIN_DESCRIPTIONS);
    }
    if (enumType === Timeframe) {
      return this.buildEnumBlock("TIMEFRAME", Timeframe, TIMEFRAME_DESCRIPTIONS);
    }
    if (enumType === EmotionPrimary) {
      return this.buildEnumBlock("EMOTION_PRIMARY", EmotionPrimary, EMOTION_PRIMARY_DESCRIPTIONS);
    }
    if (enumType === Valence) {
      return this.buildEnumBlock("VALENCE", Valence, VALENCE_DESCRIPTIONS);
    }
    if (enumType === ArousalLevel) {
      return this.buildEnumBlock("AROUSAL", ArousalLevel, AROUSAL_LEVEL_DESCRIPTIONS);
    }
    if (enumType === PerceivedControl) {
      return this.buildEnumBlock("PERCEIVED_CONTROL", PerceivedControl, PERCEIVED_CONTROL_DESCRIPTIONS);
    }
    if (enumType === MotivationStage) {
      return this.buildEnumBlock("MOTIVATION_STAGE", MotivationStage, MOTIVATION_STAGE_DESCRIPTIONS);
    }
    if (enumType === SocialSupportLevel) {
      return this.buildEnumBlock("SOCIAL_SUPPORT", SocialSupportLevel, SOCIAL_SUPPORT_LEVEL_DESCRIPTIONS);
    }
    if (enumType === RiskKind) {
      return this.buildEnumBlock("RISK_KIND", RiskKind, RISK_KIND_DESCRIPTIONS);
    }
    if (enumType === SleepQuality) {
      return this.buildEnumBlock("SLEEP_QUALITY", SleepQuality, SLEEP_QUALITY_DESCRIPTIONS);
    }
    if (enumType === CognitiveLoad) {
      return this.buildEnumBlock("COGNITIVE_LOAD", CognitiveLoad, COGNITIVE_LOAD_DESCRIPTIONS);
    }
    if (enumType === AllianceStrength) {
      return this.buildEnumBlock("ALLIANCE_STRENGTH", AllianceStrength, ALLIANCE_STRENGTH_DESCRIPTIONS);
    }
    return "";
  }

  /**
   * Get description for individual enum value
   */
  public static getEnumValueDescription(enumValue: ImpactDomain): string;
  public static getEnumValueDescription(enumValue: Timeframe): string;
  public static getEnumValueDescription(enumValue: EmotionPrimary): string;
  public static getEnumValueDescription(enumValue: Valence): string;
  public static getEnumValueDescription(enumValue: ArousalLevel): string;
  public static getEnumValueDescription(enumValue: PerceivedControl): string;
  public static getEnumValueDescription(enumValue: MotivationStage): string;
  public static getEnumValueDescription(enumValue: SocialSupportLevel): string;
  public static getEnumValueDescription(enumValue: RiskKind): string;
  public static getEnumValueDescription(enumValue: SleepQuality): string;
  public static getEnumValueDescription(enumValue: CognitiveLoad): string;
  public static getEnumValueDescription(enumValue: AllianceStrength): string;
  public static getEnumValueDescription(enumValue: any): string {
    if (typeof enumValue === "number") {
      // Check each enum type
      if (enumValue in IMPACT_DOMAIN_DESCRIPTIONS) return IMPACT_DOMAIN_DESCRIPTIONS[enumValue as ImpactDomain];
      if (enumValue in TIMEFRAME_DESCRIPTIONS) return TIMEFRAME_DESCRIPTIONS[enumValue as Timeframe];
      if (enumValue in EMOTION_PRIMARY_DESCRIPTIONS) return EMOTION_PRIMARY_DESCRIPTIONS[enumValue as EmotionPrimary];
      if (enumValue in VALENCE_DESCRIPTIONS) return VALENCE_DESCRIPTIONS[enumValue as Valence];
      if (enumValue in AROUSAL_LEVEL_DESCRIPTIONS) return AROUSAL_LEVEL_DESCRIPTIONS[enumValue as ArousalLevel];
      if (enumValue in PERCEIVED_CONTROL_DESCRIPTIONS)
        return PERCEIVED_CONTROL_DESCRIPTIONS[enumValue as PerceivedControl];
      if (enumValue in MOTIVATION_STAGE_DESCRIPTIONS)
        return MOTIVATION_STAGE_DESCRIPTIONS[enumValue as MotivationStage];
      if (enumValue in SOCIAL_SUPPORT_LEVEL_DESCRIPTIONS)
        return SOCIAL_SUPPORT_LEVEL_DESCRIPTIONS[enumValue as SocialSupportLevel];
      if (enumValue in RISK_KIND_DESCRIPTIONS) return RISK_KIND_DESCRIPTIONS[enumValue as RiskKind];
      if (enumValue in SLEEP_QUALITY_DESCRIPTIONS) return SLEEP_QUALITY_DESCRIPTIONS[enumValue as SleepQuality];
      if (enumValue in COGNITIVE_LOAD_DESCRIPTIONS) return COGNITIVE_LOAD_DESCRIPTIONS[enumValue as CognitiveLoad];
      if (enumValue in ALLIANCE_STRENGTH_DESCRIPTIONS)
        return ALLIANCE_STRENGTH_DESCRIPTIONS[enumValue as AllianceStrength];
    }
    return "Unknown enum value";
  }

  private static buildEnumBlock(blockName: string, enumObj: any, descriptions: Record<number, string>): string {
    const entries = Object.entries(enumObj)
      .filter(([key]) => isNaN(Number(key))) // Filter out reverse numeric mappings
      .map(([key, value]) => {
        const description = descriptions[value as number] || "No description";
        return `  ${value}: { name: "${key}", meaning: "${description}" }`;
      })
      .join(",\n");

    return `<${blockName}>
{
${entries}
}
</${blockName}>`;
  }

  public shouldCompressContext(): boolean {
    return this.props.notCompressedMessageCount >= CounselContexts.COMPRESSION_THRESHOLD;
  }

  public markContextCompressed(): void {
    const now = getNowDayjs();
    this.props.notCompressedMessageCount = 0;
    this.props.lastMessageCompressedAt = now;
    this.props.updatedAt = now;
  }

  public increaseNotCompressedMessageCount(): void {
    this.props.notCompressedMessageCount++;
    this.props.updatedAt = getNowDayjs();
  }

  public applyUpdates(updates: Partial<CounselContextsProps>): void {
    const now = getNowDayjs();
    const assignIfDefined = <K extends keyof CounselContextsProps>(key: K) => {
      const value = updates[key];
      if (value !== undefined) {
        (this.props as any)[key] = value as any;
      }
    };

    assignIfDefined("impactDomain");
    assignIfDefined("timeframe");
    assignIfDefined("emotionPrimary");
    assignIfDefined("valence");
    assignIfDefined("arousal");
    assignIfDefined("perceivedControl");
    assignIfDefined("motivationStage");
    assignIfDefined("socialSupport");
    assignIfDefined("riskKind");
    assignIfDefined("sleepQuality");
    assignIfDefined("emotionIntensity");
    assignIfDefined("selfEfficacy");
    assignIfDefined("riskSeverity");
    assignIfDefined("physicalSymptomsPresent");
    assignIfDefined("consentToDepth");

    this.props.updatedAt = now;
  }

  get notCompressedMessageCount(): number {
    return this.props.notCompressedMessageCount;
  }
  get lastMessageCompressedAt(): Dayjs | null {
    return this.props.lastMessageCompressedAt;
  }

  get counselId(): CounselId {
    return this.props.counselId;
  }
  get currentTechniqueMessageCount(): number {
    return this.props.currentTechniqueMessageCount;
  }
  get impactDomain(): ImpactDomain {
    return this.props.impactDomain;
  }
  get timeframe(): Timeframe {
    return this.props.timeframe;
  }
  get emotionPrimary(): EmotionPrimary {
    return this.props.emotionPrimary;
  }
  get valence(): Valence {
    return this.props.valence;
  }
  get arousal(): ArousalLevel {
    return this.props.arousal;
  }
  get perceivedControl(): PerceivedControl {
    return this.props.perceivedControl;
  }
  get motivationStage(): MotivationStage {
    return this.props.motivationStage;
  }
  get socialSupport(): SocialSupportLevel {
    return this.props.socialSupport;
  }
  get riskKind(): RiskKind {
    return this.props.riskKind;
  }
  get sleepQuality(): SleepQuality {
    return this.props.sleepQuality;
  }
  get cognitiveLoad(): CognitiveLoad {
    return this.props.cognitiveLoad;
  }
  get allianceStrength(): AllianceStrength {
    return this.props.allianceStrength;
  }
  get riskSeverity(): 0 | 1 | 2 | 3 | null {
    return this.props.riskSeverity;
  }
  get selfEfficacy(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null {
    return this.props.selfEfficacy;
  }
  get emotionIntensity(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null {
    return this.props.emotionIntensity;
  }
  get physicalSymptomsPresent(): boolean | null {
    return this.props.physicalSymptomsPresent;
  }
  get consentToDepth(): boolean | null {
    return this.props.consentToDepth;
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
