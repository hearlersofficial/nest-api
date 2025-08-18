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

export enum ContextDomain {
  EMOTION = "EMOTION",
  RISK = "RISK",
  MOTIVATION = "MOTIVATION",
  SUPPORT_SLEEP_COGNITIVE = "SUPPORT_SLEEP_COGNITIVE",
  ALLIANCE = "ALLIANCE",
  IMPACT_TIMEFRAME = "IMPACT_TIMEFRAME",
}

// Field Description Type
interface FieldDescription {
  type: "enum" | "integer" | "boolean";
  description: string;
  values: Record<string | number, string>;
}

export const FIELD_DESCRIPTIONS: Record<string, FieldDescription> = {
  // Impact Domain
  impactDomain: {
    type: "enum",
    description: "Areas of life impact",
    values: {
      [ImpactDomain.UNSPECIFIED]: "Unspecified or unclear domain",
      [ImpactDomain.WORK]: "Work or academic functioning",
      [ImpactDomain.STUDY]: "Study or academic performance",
      [ImpactDomain.RELATIONSHIP]: "Family, friends, romantic relationships",
      [ImpactDomain.FAMILY]: "Family relationships",
      [ImpactDomain.HEALTH]: "Physical or mental health concerns",
      [ImpactDomain.FINANCE]: "Financial stressors",
      [ImpactDomain.SELF]: "Self-concept, identity, personal growth",
      [ImpactDomain.OTHER]: "Other domains",
    },
  },

  // Timeframe
  timeframe: {
    type: "enum",
    description: "Temporal context of issues",
    values: {
      [Timeframe.UNSPECIFIED]: "Unspecified or unclear timeframe",
      [Timeframe.TODAY]: "Very recent or sudden onset",
      [Timeframe.THIS_WEEK]: "Within the past week",
      [Timeframe.THIS_MONTH]: "Within the past month",
      [Timeframe.THIS_YEAR]: "Within the past year",
      [Timeframe.LONGER]: "Longer than a year ago",
    },
  },

  // Emotion Primary
  emotionPrimary: {
    type: "enum",
    description: "Primary emotional state",
    values: {
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
    },
  },

  // Valence
  valence: {
    type: "enum",
    description: "Emotional valence",
    values: {
      [Valence.UNSPECIFIED]: "Unspecified or unclear valence",
      [Valence.POSITIVE]: "Generally pleasant or desired",
      [Valence.NEGATIVE]: "Generally unpleasant or undesired",
      [Valence.NEUTRAL]: "Neither clearly pleasant nor unpleasant",
    },
  },

  // Arousal Level
  arousal: {
    type: "enum",
    description: "Arousal level",
    values: {
      [ArousalLevel.UNSPECIFIED]: "Unspecified or unclear arousal",
      [ArousalLevel.LOW]: "Calm or subdued activation",
      [ArousalLevel.MEDIUM]: "Moderate activation",
      [ArousalLevel.HIGH]: "Heightened activation",
    },
  },

  // Perceived Control
  perceivedControl: {
    type: "enum",
    description: "Perceived control over circumstances",
    values: {
      [PerceivedControl.UNSPECIFIED]: "Unspecified perceived control",
      [PerceivedControl.LOW]: "Feels little control",
      [PerceivedControl.MEDIUM]: "Some control",
      [PerceivedControl.HIGH]: "Strong sense of control",
    },
  },

  // Motivation Stage
  motivationStage: {
    type: "enum",
    description: "Stage of motivation for change",
    values: {
      [MotivationStage.UNSPECIFIED]: "Unspecified stage",
      [MotivationStage.PRECONTEMPLATION]: "Unready to change",
      [MotivationStage.CONTEMPLATION]: "Ambivalent, considering",
      [MotivationStage.PREPARATION]: "Planning change",
      [MotivationStage.ACTION]: "Actively changing",
      [MotivationStage.MAINTENANCE]: "Sustaining change",
    },
  },

  // Social Support Level
  socialSupport: {
    type: "enum",
    description: "Level of social support",
    values: {
      [SocialSupportLevel.UNSPECIFIED]: "Unspecified support level",
      [SocialSupportLevel.NONE]: "No perceived support",
      [SocialSupportLevel.LOW]: "Limited perceived support",
      [SocialSupportLevel.MEDIUM]: "Some consistent support",
      [SocialSupportLevel.HIGH]: "Strong reliable network",
    },
  },

  // Risk Kind
  riskKind: {
    type: "enum",
    description: "Type of risk identified",
    values: {
      [RiskKind.UNSPECIFIED]: "Unspecified risk kind",
      [RiskKind.NONE]: "No notable risk indicated",
      [RiskKind.SELF_HARM]: "Self-harm ideation/behaviors",
      [RiskKind.HARM_TO_OTHERS]: "Risk of harm to others",
      [RiskKind.ABUSE]: "Abuse/violence risk present",
    },
  },

  // Sleep Quality
  sleepQuality: {
    type: "enum",
    description: "Quality of sleep",
    values: {
      [SleepQuality.UNSPECIFIED]: "Unspecified sleep quality",
      [SleepQuality.POOR]: "Frequent disturbance and low restfulness",
      [SleepQuality.FAIR]: "Some issues but manageable",
      [SleepQuality.GOOD]: "Generally restorative sleep",
    },
  },

  // Cognitive Load
  cognitiveLoad: {
    type: "enum",
    description: "Level of cognitive demands",
    values: {
      [CognitiveLoad.UNSPECIFIED]: "Unspecified cognitive load",
      [CognitiveLoad.LOW]: "Few concurrent demands",
      [CognitiveLoad.MEDIUM]: "Manageable demands",
      [CognitiveLoad.HIGH]: "Many competing demands",
    },
  },

  // Alliance Strength
  allianceStrength: {
    type: "enum",
    description: "Therapeutic alliance strength",
    values: {
      [AllianceStrength.UNSPECIFIED]: "Unspecified alliance strength",
      [AllianceStrength.WEAK]: "Limited trust/rapport",
      [AllianceStrength.MEDIUM]: "Working alliance is acceptable",
      [AllianceStrength.STRONG]: "High trust and collaboration",
    },
  },

  // Emotion Intensity (Integer 0-10)
  emotionIntensity: {
    type: "integer",
    description: "Emotional intensity scale (0-10)",
    values: {
      0: "No emotional intensity",
      1: "Minimal emotional intensity",
      2: "Very mild emotional state",
      3: "Mild emotional intensity",
      4: "Low-moderate emotional state",
      5: "Moderate emotional intensity",
      6: "Moderate-high emotional state",
      7: "Strong emotional intensity",
      8: "Very strong emotional state",
      9: "Intense emotional state",
      10: "Maximum emotional intensity",
    },
  },

  // Self Efficacy (Integer 0-10)
  selfEfficacy: {
    type: "integer",
    description: "Self-efficacy confidence scale (0-10)",
    values: {
      0: "No confidence in ability to change",
      1: "Extremely low confidence",
      2: "Very low confidence in change",
      3: "Low confidence, significant doubts",
      4: "Below average confidence",
      5: "Moderate confidence, some uncertainty",
      6: "Above moderate confidence",
      7: "High confidence in ability to change",
      8: "Very high confidence",
      9: "Extremely high confidence",
      10: "Complete confidence in ability to change",
    },
  },

  // Risk Severity (Integer 0-3)
  riskSeverity: {
    type: "integer",
    description: "Risk severity assessment scale (0-3)",
    values: {
      0: "NONE - No immediate severity or risk indicators",
      1: "LOW - Mild concerns present, monitor and follow up",
      2: "MODERATE - Clear risk factors identified, safety planning indicated",
      3: "HIGH - Imminent risk, urgent intervention required",
    },
  },

  // Consent to Depth (Boolean)
  consentToDepth: {
    type: "boolean",
    description: "Client readiness for therapeutic depth",
    values: {
      true: "Open to deeper exploration, vulnerability, and meaningful therapeutic work",
      false: "Prefers to stay at surface level, shows resistance to depth, or maintains defensive barriers",
      null: "Unclear from current conversation, insufficient evidence to determine readiness",
    },
  },

  // Physical Symptoms Present (Boolean)
  physicalSymptomsPresent: {
    type: "boolean",
    description: "Presence of physical symptoms or somatic complaints",
    values: {
      true: "Physical symptoms or somatic complaints are mentioned",
      false: "No physical symptoms reported or explicitly denied",
      null: "Unclear from current conversation, insufficient evidence",
    },
  },
};

// Domain Configuration
interface ContextDomainConfig {
  domain: ContextDomain;
  description: string;
  relatedFields: string[];
  analysisGuidelines: string;
}

export const CONTEXT_DOMAIN_REGISTRY: Record<ContextDomain, ContextDomainConfig> = {
  [ContextDomain.EMOTION]: {
    domain: ContextDomain.EMOTION,
    description: "Emotional state analysis including primary emotions, valence, arousal, and intensity",
    relatedFields: ["emotionPrimary", "valence", "arousal", "emotionIntensity"],
    analysisGuidelines:
      "Look for emotional shifts, new emotional expressions, changes in intensity, or emotional responses to events",
  },
  [ContextDomain.RISK]: {
    domain: ContextDomain.RISK,
    description: "Risk assessment for self-harm, harm to others, or abuse situations",
    relatedFields: ["riskKind", "riskSeverity"],
    analysisGuidelines: "Identify any mentions of harm, safety concerns, suicidal ideation, or dangerous behaviors",
  },
  [ContextDomain.MOTIVATION]: {
    domain: ContextDomain.MOTIVATION,
    description: "Motivation for change and perceived control over circumstances",
    relatedFields: ["motivationStage", "perceivedControl", "selfEfficacy"],
    analysisGuidelines: "Assess readiness for change, sense of agency, confidence in abilities, and motivation levels",
  },
  [ContextDomain.SUPPORT_SLEEP_COGNITIVE]: {
    domain: ContextDomain.SUPPORT_SLEEP_COGNITIVE,
    description: "Social support networks, sleep quality, and cognitive load management",
    relatedFields: ["socialSupport", "sleepQuality", "cognitiveLoad", "physicalSymptomsPresent"],
    analysisGuidelines:
      "Evaluate support system changes, sleep pattern discussions, and cognitive/mental capacity indicators",
  },
  [ContextDomain.ALLIANCE]: {
    domain: ContextDomain.ALLIANCE,
    description: "Therapeutic alliance strength and client engagement",
    relatedFields: ["allianceStrength", "consentToDepth"],
    analysisGuidelines:
      "Monitor trust levels, engagement quality, resistance, and willingness to explore deeper issues",
  },
  [ContextDomain.IMPACT_TIMEFRAME]: {
    domain: ContextDomain.IMPACT_TIMEFRAME,
    description: "Areas of life impact and temporal context of issues",
    relatedFields: ["impactDomain", "timeframe"],
    analysisGuidelines: "Identify which life domains are affected and when issues began or changed",
  },
};
