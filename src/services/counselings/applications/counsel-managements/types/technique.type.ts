import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";

export type TechniqueTransitionEvaluationParams = {
  currentTechniqueId: string;
  nextTechniqueId: string;
  messages: CounselMessageInfo[];
  messageThreshold: number;
};

export type TechniqueTransitionScore = {
  completionScore: number; // 현재 기법의 완료/달성도 (0-100)
  readinessScore: number; // 다음 단계로의 준비도/의지/통찰 (0-100)
  alignmentScore: number; // 다음 기법과의 개념적/시간적 정합성 (0-100)
  reasoning: string; // 판별 근거 요약
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
  ruleApplied?: string; // 적용된 규칙 설명
};

// 백그라운드 기법 전환 평가 결과
export type BackgroundTechniqueEvaluationResult = {
  evaluationPerformed: boolean;
  decision?: TechniqueTransitionDecision;
  error?: string;
};
