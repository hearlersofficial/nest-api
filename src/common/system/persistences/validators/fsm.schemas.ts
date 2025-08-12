// ~common/system/persistences/validators/fsm.schemas.ts
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
} from "~common/shared/enums/counsel-context"; // 사용자가 선언한 enum 경로
import { z } from "zod";

// // --- 세션 요약 슬롯: 한 줄 텍스트 3개 (모두 optional) ---
// export type SessionSlots = Partial<{
//   presenting_problem_one_line: string;
//   anchor_event_one_scene: string;
//   today_goal_one_line: string;
// }>;
// export const zSessionSlots = z
//   .object({
//     presenting_problem_one_line: z.string().min(1).max(200).optional(),
//     anchor_event_one_scene: z.string().min(1).max(200).optional(),
//     today_goal_one_line: z.string().min(1).max(200).optional(),
//   })
//   .strict();

// --- 지속 컨텍스트: 모르면 null 허용 ---
export type CounselState = {
  impact_domain?: ImpactDomain | null;
  timeframe?: Timeframe | null;
  emotion_primary?: EmotionPrimary | null;
  valence?: Valence | null;
  arousal?: ArousalLevel | null;
  emotion_intensity_0_to_10?: number | null;
  perceived_control?: PerceivedControl | null;
  motivation_stage?: MotivationStage | null;
  self_efficacy_0_to_10?: number | null;
  social_support?: SocialSupportLevel | null;
  risk_kind?: RiskKind | null;
  risk_severity_0_to_3?: 0 | 1 | 2 | 3 | null;
  sleep_quality?: SleepQuality | null;
  physical_symptoms_present?: boolean | null;
  cognitive_load?: CognitiveLoad | null;
  alliance_strength?: AllianceStrength | null;
  consent_to_depth?: boolean | null;
};
export const zCounselState = z
  .object({
    impact_domain: z.nativeEnum(ImpactDomain).nullable().optional(),
    timeframe: z.nativeEnum(Timeframe).nullable().optional(),
    emotion_primary: z.nativeEnum(EmotionPrimary).nullable().optional(),
    valence: z.nativeEnum(Valence).nullable().optional(),
    arousal: z.nativeEnum(ArousalLevel).nullable().optional(),
    emotion_intensity_0_to_10: z.number().min(0).max(10).nullable().optional(),
    perceived_control: z.nativeEnum(PerceivedControl).nullable().optional(),
    motivation_stage: z.nativeEnum(MotivationStage).nullable().optional(),
    self_efficacy_0_to_10: z.number().min(0).max(10).nullable().optional(),
    social_support: z.nativeEnum(SocialSupportLevel).nullable().optional(),
    risk_kind: z.nativeEnum(RiskKind).nullable().optional(),
    risk_severity_0_to_3: z
      .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
      .nullable()
      .optional(),
    sleep_quality: z.nativeEnum(SleepQuality).nullable().optional(),
    physical_symptoms_present: z.boolean().nullable().optional(),
    cognitive_load: z.nativeEnum(CognitiveLoad).nullable().optional(),
    alliance_strength: z.nativeEnum(AllianceStrength).nullable().optional(),
    consent_to_depth: z.boolean().nullable().optional(),
  })
  .strict();

// --- JSONB 트랜스포머 ---
import type { ValueTransformer } from "typeorm";
export const jsonbTransformer = <T>(schema: z.ZodTypeAny): ValueTransformer => ({
  to: (value: T | null | undefined) => (value == null ? {} : schema.parse(value)),
  from: (value: unknown) => schema.parse(value ?? {}) as T,
});
