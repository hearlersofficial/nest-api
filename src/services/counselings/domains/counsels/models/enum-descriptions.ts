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

export const IMPACT_DOMAIN_DESCRIPTIONS: Record<ImpactDomain, string> = {
  [ImpactDomain.UNSPECIFIED]: "Unspecified or unclear domain",
  [ImpactDomain.WORK]: "Work or academic functioning",
  [ImpactDomain.STUDY]: "Study or academic performance",
  [ImpactDomain.RELATIONSHIP]: "Family, friends, romantic relationships",
  [ImpactDomain.FAMILY]: "Family relationships",
  [ImpactDomain.HEALTH]: "Physical or mental health concerns",
  [ImpactDomain.FINANCE]: "Financial stressors",
  [ImpactDomain.SELF]: "Self-concept, identity, personal growth",
  [ImpactDomain.OTHER]: "Other domains",
};

export const TIMEFRAME_DESCRIPTIONS: Record<Timeframe, string> = {
  [Timeframe.UNSPECIFIED]: "Unspecified or unclear timeframe",
  [Timeframe.TODAY]: "Very recent or sudden onset",
  [Timeframe.THIS_WEEK]: "Within the past week",
  [Timeframe.THIS_MONTH]: "Within the past month",
  [Timeframe.THIS_YEAR]: "Within the past year",
  [Timeframe.LONGER]: "Longer than a year ago",
};

export const EMOTION_PRIMARY_DESCRIPTIONS: Record<EmotionPrimary, string> = {
  [EmotionPrimary.UNSPECIFIED]: "Unspecified or unclear emotion",
  [EmotionPrimary.ANXIETY]: "Anxiety, worry, perceived threat",
  [EmotionPrimary.SADNESS]: "Low mood, loss, grief",
  [EmotionPrimary.ANGER]: "Irritation, frustration, boundary concern",
  [EmotionPrimary.LONELINESS]: "Feeling isolated or disconnected",
  [EmotionPrimary.GUILT]: "Self-blame or regret",
  [EmotionPrimary.SHAME]: "Deep sense of inadequacy or unworthiness",
  [EmotionPrimary.STRESS]: "Overwhelm or pressure",
  [EmotionPrimary.HOPE]: "Optimism or positive expectation",
  [EmotionPrimary.CALM]: "Peaceful or relaxed state",
  [EmotionPrimary.OTHER]: "Other emotion not listed",
};

export const VALENCE_DESCRIPTIONS: Record<Valence, string> = {
  [Valence.UNSPECIFIED]: "Unspecified or unclear valence",
  [Valence.POSITIVE]: "Generally pleasant or desired",
  [Valence.NEGATIVE]: "Generally unpleasant or undesired",
  [Valence.NEUTRAL]: "Neither clearly pleasant nor unpleasant",
};

export const AROUSAL_LEVEL_DESCRIPTIONS: Record<ArousalLevel, string> = {
  [ArousalLevel.UNSPECIFIED]: "Unspecified or unclear arousal",
  [ArousalLevel.LOW]: "Calm or subdued activation",
  [ArousalLevel.MEDIUM]: "Moderate activation",
  [ArousalLevel.HIGH]: "Heightened activation",
};

export const PERCEIVED_CONTROL_DESCRIPTIONS: Record<PerceivedControl, string> = {
  [PerceivedControl.UNSPECIFIED]: "Unspecified perceived control",
  [PerceivedControl.LOW]: "Feels little control",
  [PerceivedControl.MEDIUM]: "Some control",
  [PerceivedControl.HIGH]: "Strong sense of control",
};

export const MOTIVATION_STAGE_DESCRIPTIONS: Record<MotivationStage, string> = {
  [MotivationStage.UNSPECIFIED]: "Unspecified stage",
  [MotivationStage.PRECONTEMPLATION]: "Unready to change",
  [MotivationStage.CONTEMPLATION]: "Ambivalent, considering",
  [MotivationStage.PREPARATION]: "Planning change",
  [MotivationStage.ACTION]: "Actively changing",
  [MotivationStage.MAINTENANCE]: "Sustaining change",
};

export const SOCIAL_SUPPORT_LEVEL_DESCRIPTIONS: Record<SocialSupportLevel, string> = {
  [SocialSupportLevel.UNSPECIFIED]: "Unspecified support level",
  [SocialSupportLevel.NONE]: "No perceived support",
  [SocialSupportLevel.LOW]: "Limited perceived support",
  [SocialSupportLevel.MEDIUM]: "Some consistent support",
  [SocialSupportLevel.HIGH]: "Strong reliable network",
};

export const RISK_KIND_DESCRIPTIONS: Record<RiskKind, string> = {
  [RiskKind.UNSPECIFIED]: "Unspecified risk kind",
  [RiskKind.NONE]: "No notable risk indicated",
  [RiskKind.SELF_HARM]: "Self-harm ideation/behaviors",
  [RiskKind.HARM_TO_OTHERS]: "Risk of harm to others",
  [RiskKind.ABUSE]: "Abuse/violence risk present",
};

export const SLEEP_QUALITY_DESCRIPTIONS: Record<SleepQuality, string> = {
  [SleepQuality.UNSPECIFIED]: "Unspecified sleep quality",
  [SleepQuality.POOR]: "Frequent disturbance and low restfulness",
  [SleepQuality.FAIR]: "Some issues but manageable",
  [SleepQuality.GOOD]: "Generally restorative sleep",
};

export const COGNITIVE_LOAD_DESCRIPTIONS: Record<CognitiveLoad, string> = {
  [CognitiveLoad.UNSPECIFIED]: "Unspecified cognitive load",
  [CognitiveLoad.LOW]: "Few concurrent demands",
  [CognitiveLoad.MEDIUM]: "Manageable demands",
  [CognitiveLoad.HIGH]: "Many competing demands",
};

export const ALLIANCE_STRENGTH_DESCRIPTIONS: Record<AllianceStrength, string> = {
  [AllianceStrength.UNSPECIFIED]: "Unspecified alliance strength",
  [AllianceStrength.WEAK]: "Limited trust/rapport",
  [AllianceStrength.MEDIUM]: "Working alliance is acceptable",
  [AllianceStrength.STRONG]: "High trust and collaboration",
};
