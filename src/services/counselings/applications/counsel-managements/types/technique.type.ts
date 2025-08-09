import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";

export type TechniqueTransitionEvaluationParams = {
  currentTechniqueId: string;
  nextTechniqueId: string;
  messages: CounselMessageInfo[];
  messageThreshold: number;
};

export type TechniqueTransitionScore = {
  conversationProgressScore: number; // 대화 진행도 점수 (0-100)
  userEngagementScore: number; // 사용자 참여도 점수 (0-100)
  goalAchievementScore: number; // 목표 달성도 점수 (0-100)
  appropriatenessScore: number; // 다음 기법 적절성 점수 (0-100)
  overallScore: number; // 전체 점수 (0-100)
  reasoning: string; // 판별 근거
};

export type TechniqueEvaluationEvidence = {
  quote: string; // 대화에서 인용한 근거 문장
  rationale: string; // 해당 인용이 점수/판단에 기여한 이유
};

export type TechniqueTransitionDecision = {
  shouldTransition: boolean;
  scores: TechniqueTransitionScore;
  confidence: number; // 신뢰도 (0-100)
  evidence?: TechniqueEvaluationEvidence[]; // 선택적 근거 목록
  unmetCriteria?: string[]; // 미충족 기준 목록
  redFlags?: string[]; // 안전/위험 신호 목록 (존재 시 전환 금지)
  ruleApplied?: string; // 적용된 규칙 설명
};

// 백그라운드 기법 전환 평가 결과
export type BackgroundTechniqueEvaluationResult = {
  evaluationPerformed: boolean;
  decision?: TechniqueTransitionDecision;
  error?: string;
};
