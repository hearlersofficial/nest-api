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

import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";
import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";

@Entity({ name: "counsel_contexts", comment: "상담 컨텍스트" })
export class CounselContextsEntity extends CoreEntity {
  @Column({
    type: "int",
    name: "current_technique_message_count",
    default: 0,
    comment: "현 기법에서 누적 메시지 수(>=0)",
  })
  currentTechniqueMessageCount!: number;

  @Column({ type: "int", name: "impact_domain", nullable: true, comment: "삶의 영역" })
  impactDomain!: ImpactDomain;

  @Column({ type: "int", name: "timeframe", nullable: true, comment: "문제 체감 최근성" })
  timeframe!: Timeframe;

  @Column({ type: "int", name: "emotion_primary", nullable: true, comment: "주요 감정" })
  emotionPrimary!: EmotionPrimary;

  @Column({ type: "int", name: "valence", nullable: true, comment: "정서 쾌·불쾌" })
  valence!: Valence;

  @Column({ type: "int", name: "arousal", nullable: true, comment: "각성 수준" })
  arousal!: ArousalLevel;

  @Column({ type: "int", name: "emotion_intensity", nullable: true, comment: "감정 강도(0~10)" })
  emotionIntensity!: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null;

  @Column({ type: "int", name: "perceived_control", nullable: true, comment: "상황 통제감" })
  perceivedControl!: PerceivedControl;

  @Column({ type: "int", name: "motivation_stage", nullable: true, comment: "변화 단계" })
  motivationStage!: MotivationStage;

  @Column({ type: "int", name: "self_efficacy", nullable: true, comment: "자기효능감(0~10)" })
  selfEfficacy!: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null;

  @Column({ type: "int", name: "social_support", nullable: true, comment: "사회적 지지" })
  socialSupport!: SocialSupportLevel;

  @Column({ type: "int", name: "risk_kind", nullable: true, comment: "위험 분류" })
  riskKind!: RiskKind;

  @Column({ type: "int", name: "risk_severity", nullable: true, comment: "위험 심각도(0~3)" })
  riskSeverity!: 0 | 1 | 2 | 3 | null;

  @Column({ type: "int", name: "sleep_quality", nullable: true, comment: "수면 질" })
  sleepQuality!: SleepQuality;

  @Column({ type: "boolean", name: "physical_symptoms_present", nullable: true, comment: "신체 증상 유무" })
  physicalSymptomsPresent!: boolean | null;

  @Column({ type: "int", name: "cognitive_load", nullable: true, comment: "인지 부하" })
  cognitiveLoad!: CognitiveLoad;

  @Column({ type: "int", name: "alliance_strength", nullable: true, comment: "라포·동맹" })
  allianceStrength!: AllianceStrength;

  @Column({ type: "boolean", name: "consent_to_depth", nullable: true, comment: "심층 동의" })
  consentToDepth!: boolean | null;

  @OneToOne(() => CounselsEntity, (counsel) => counsel.counselContext, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counsel_id" })
  counsel!: CounselsEntity;

  @RelationId((ctx: CounselContextsEntity) => ctx.counsel)
  @Column({ type: "bigint", name: "counsel_id" })
  counselId!: string;
}
