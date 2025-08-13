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
    return this.emotionIntensity;
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
