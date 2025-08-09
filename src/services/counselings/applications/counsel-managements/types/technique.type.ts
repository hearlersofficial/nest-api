import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";

export type TechniqueTransitionEvaluationParams = {
  currentTechniqueId: string;
  nextTechniqueId: string;
  messages: CounselMessageInfo[];
  messageThreshold: number;
};

export type TechniqueTransitionScore = {
  techniqueCompletionScore: number; // 현재 기법의 목표/과제 달성도 (0-100)
  nextTechniqueFitScore: number; // 다음 기법과의 개념적/상황적 적합도 (0-100)
  allianceStrengthScore: number; // 치료적 동맹(관계/과제/목표 합의) 강도 (0-100)
  clientReadinessScore: number; // 다음 단계로의 준비도/의지/통찰 (0-100)
  riskStabilityScore: number; // 위험/불안정성의 반대 지표: 높을수록 안전/안정 (0-100)
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
  redFlags?: string[]; // 안전/위험 신호 목록 (존재 시 전환 금지)
  ruleApplied?: string; // 적용된 규칙 설명
};

// 백그라운드 기법 전환 평가 결과
export type BackgroundTechniqueEvaluationResult = {
  evaluationPerformed: boolean;
  decision?: TechniqueTransitionDecision;
  error?: string;
};
