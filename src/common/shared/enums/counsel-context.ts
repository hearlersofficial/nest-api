// 이 값들은 "기법 독립적"이며, 모르면 null 허용.
// 문자열 enum은 WORK = "WORK"와 같이 선언.

export enum ImpactDomain {
  WORK = "WORK",
  STUDY = "STUDY",
  RELATIONSHIP = "RELATIONSHIP",
  FAMILY = "FAMILY",
  HEALTH = "HEALTH",
  FINANCE = "FINANCE",
  SELF = "SELF",
  OTHER = "OTHER",
} // 삶의 어느 영역이 주로 영향을 받는지(문제 맥락 차원)

export enum Timeframe {
  TODAY = "TODAY",
  THIS_WEEK = "THIS_WEEK",
  THIS_MONTH = "THIS_MONTH",
  LONGER = "LONGER",
} // 문제 체감의 최근성(시간 맥락)

export enum EmotionPrimary {
  ANXIETY = "ANXIETY",
  SADNESS = "SADNESS",
  ANGER = "ANGER",
  LONELINESS = "LONELINESS",
  GUILT = "GUILT",
  SHAME = "SHAME",
  STRESS = "STRESS",
  HOPE = "HOPE",
  CALM = "CALM",
  OTHER = "OTHER",
} // 원형 감정(라벨은 Circumplex/CBT에서 빈도 높은 것만)

export enum Valence {
  NEGATIVE = "NEGATIVE",
  NEUTRAL = "NEUTRAL",
  POSITIVE = "POSITIVE",
} // 정서 쾌·불쾌 축
export enum ArousalLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
} // 각성 수준(에너지 축)

export enum PerceivedControl {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
} // 상황 통제감(인지평가 이론 기반)

export enum MotivationStage {
  PRECONTEMPLATION = "PRECONTEMPLATION",
  CONTEMPLATION = "CONTEMPLATION",
  PREPARATION = "PREPARATION",
  ACTION = "ACTION",
  MAINTENANCE = "MAINTENANCE",
} // 변화 단계(Transtheoretical Model)

export enum SocialSupportLevel {
  NONE = "NONE",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
} // 지지 자원

export enum RiskKind {
  NONE = "NONE",
  SELF_HARM = "SELF_HARM",
  HARM_TO_OTHERS = "HARM_TO_OTHERS",
  ABUSE = "ABUSE",
} // 안전 인터럽트 분류(발견 즉시 우선 처리)

export enum SleepQuality {
  POOR = "POOR",
  FAIR = "FAIR",
  GOOD = "GOOD",
} // 수면(기분·스트레스의 강력한 공변량)

export enum CognitiveLoad {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
} // 인지 부하(집중·결정 피로도)

export enum AllianceStrength {
  WEAK = "WEAK",
  MEDIUM = "MEDIUM",
  STRONG = "STRONG",
} // 라포·작업동맹 체감

// export enum PreferenceTone {
//   SUPPORT_WARM = "SUPPORT_WARM", // 정서적 지지·따뜻함
//   RELIEF_SOOTHING = "RELIEF_SOOTHING", // 안심·이완 유도
//   PROBLEM_CALM = "PROBLEM_CALM", // 문제 구조화·차분
//   ENCOURAGE_BRIGHT = "ENCOURAGE_BRIGHT", // 격려·활기
// } // 응답 톤 선호(대화 안전감에 중요)
