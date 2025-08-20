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
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({ name: "counsel_technique_transition_rules", comment: "상담 기법 전이 규칙 (기법의 전이 함수)" })
export class CounselTechniqueTransitionRuleEntity extends CoreEntity {
  // 출발 상태
  @ManyToOne(() => CounselTechniquesEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "from_counsel_technique_id" })
  fromCounselTechnique: CounselTechniquesEntity;

  @RelationId((rule: CounselTechniqueTransitionRuleEntity) => rule.fromCounselTechnique)
  @Column({ type: "bigint", name: "from_counsel_technique_id" })
  fromCounselTechniqueId: string;

  // 도착 상태
  @ManyToOne(() => CounselTechniquesEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "to_counsel_technique_id" })
  toCounselTechnique: CounselTechniquesEntity;

  @RelationId((rule: CounselTechniqueTransitionRuleEntity) => rule.toCounselTechnique)
  @Column({ type: "bigint", name: "to_counsel_technique_id" })
  toCounselTechniqueId: string;

  @Column({ type: "int", name: "priority", comment: "전이 우선순위 (숫자가 높을수록 우선)", default: 0 })
  priority: number;

  // --- 전이 조건 필드 (CounselContextsEntity 필드 기반) ---
  // 모든 조건은 AND로 평가됩니다. null인 필드는 평가에서 제외됩니다.

  // 메시지 수 관련 조건
  @Column({
    type: "int",
    name: "min_not_compressed_message_count",
    nullable: true,
    comment: "최소 압축되지 않은 메시지 수",
  })
  minNotCompressedMessageCount: number | null;

  @Column({
    type: "int",
    name: "max_not_compressed_message_count",
    nullable: true,
    comment: "최대 압축되지 않은 메시지 수",
  })
  maxNotCompressedMessageCount: number | null;

  @Column({
    type: "int",
    name: "min_current_technique_message_count",
    nullable: true,
    comment: "최소 현 기법 메시지 수",
  })
  minCurrentTechniqueMessageCount: number | null;

  @Column({
    type: "int",
    name: "max_current_technique_message_count",
    nullable: true,
    comment: "최대 현 기법 메시지 수",
  })
  maxCurrentTechniqueMessageCount: number | null;

  // 삶의 영역 및 시간 관련 조건
  @Column({ type: "simple-array", name: "required_impact_domains", nullable: true, comment: "필수 삶의 영역" })
  requiredImpactDomains: ImpactDomain[] | null;

  @Column({ type: "simple-array", name: "required_timeframes", nullable: true, comment: "필수 문제 체감 최근성" })
  requiredTimeframes: Timeframe[] | null;

  // 감정 관련 조건
  @Column({ type: "simple-array", name: "required_emotion_primaries", nullable: true, comment: "필수 주요 감정" })
  requiredEmotionPrimaries: EmotionPrimary[] | null;

  @Column({ type: "simple-array", name: "required_valences", nullable: true, comment: "필수 정서 쾌·불쾌" })
  requiredValences: Valence[] | null;

  @Column({ type: "simple-array", name: "required_arousal_levels", nullable: true, comment: "필수 각성 수준" })
  requiredArousalLevels: ArousalLevel[] | null;

  @Column({ type: "int", name: "min_emotion_intensity", nullable: true, comment: "최소 감정 강도" })
  minEmotionIntensity: number | null;

  @Column({ type: "int", name: "max_emotion_intensity", nullable: true, comment: "최대 감정 강도" })
  maxEmotionIntensity: number | null;

  // 통제감 및 동기 관련 조건
  @Column({ type: "simple-array", name: "required_perceived_controls", nullable: true, comment: "필수 상황 통제감" })
  requiredPerceivedControls: PerceivedControl[] | null;

  @Column({ type: "simple-array", name: "required_motivation_stages", nullable: true, comment: "필수 변화 단계" })
  requiredMotivationStages: MotivationStage[] | null;

  @Column({ type: "int", name: "min_self_efficacy", nullable: true, comment: "최소 자기효능감" })
  minSelfEfficacy: number | null;

  @Column({ type: "int", name: "max_self_efficacy", nullable: true, comment: "최대 자기효능감" })
  maxSelfEfficacy: number | null;

  // 사회적 지지 관련 조건
  @Column({ type: "simple-array", name: "required_social_support_levels", nullable: true, comment: "필수 사회적 지지" })
  requiredSocialSupportLevels: SocialSupportLevel[] | null;

  // 위험 관련 조건
  @Column({ type: "simple-array", name: "required_risk_kinds", nullable: true, comment: "필수 위험 분류" })
  requiredRiskKinds: RiskKind[] | null;

  @Column({ type: "int", name: "min_risk_severity", nullable: true, comment: "최소 위험 심각도" })
  minRiskSeverity: number | null;

  @Column({ type: "int", name: "max_risk_severity", nullable: true, comment: "최대 위험 심각도" })
  maxRiskSeverity: number | null;

  // 수면 및 신체 증상 관련 조건
  @Column({ type: "simple-array", name: "required_sleep_qualities", nullable: true, comment: "필수 수면 질" })
  requiredSleepQualities: SleepQuality[] | null;

  @Column({
    type: "boolean",
    name: "required_physical_symptoms_present",
    nullable: true,
    comment: "필수 신체 증상 유무",
  })
  requiredPhysicalSymptomsPresent: boolean | null;

  // 인지 부하 관련 조건
  @Column({ type: "simple-array", name: "required_cognitive_loads", nullable: true, comment: "필수 인지 부하" })
  requiredCognitiveLoads: CognitiveLoad[] | null;

  // 동맹 관련 조건
  @Column({ type: "simple-array", name: "required_alliance_strengths", nullable: true, comment: "필수 라포·동맹" })
  requiredAllianceStrengths: AllianceStrength[] | null;

  // 심층 동의 관련 조건
  @Column({ type: "boolean", name: "required_consent_to_depth", nullable: true, comment: "필수 심층 동의" })
  requiredConsentToDepth: boolean | null;
}
