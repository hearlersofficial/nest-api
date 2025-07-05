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

export type TechniqueTransitionDecision = {
  shouldTransition: boolean;
  scores: TechniqueTransitionScore;
  confidence: number; // 신뢰도 (0-100)
};

// 백그라운드 기법 전환 평가 결과
export type BackgroundTechniqueEvaluationResult = {
  evaluationPerformed: boolean;
  decision?: TechniqueTransitionDecision;
  error?: string;
};
