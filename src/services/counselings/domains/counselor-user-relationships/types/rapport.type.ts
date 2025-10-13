import { CounselorUserRelationshipInfo } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationship-info";

/** 이벤트 종류 */
export interface UserMessageSource {
  type: "USER_MESSAGE";
  payload: {
    hasEmotionTag: boolean;
    textLength: number;
  };
}
export interface TaskCompletedSource {
  type: "TASK_COMPLETED";
  payload: {
    taskKind: string;
  };
}

export interface SessionTickSource {
  type: "SESSION_TICK";
  payload: {
    minutesElapsed: number;
  };
}

/** 이벤트 소스 타입 추출 */
export type RapportCalcSource = UserMessageSource | TaskCompletedSource | SessionTickSource;
export type RapportCalcSourceType = RapportCalcSource["type"];

/** 규칙/정책 정의 - 기본/추가점수 분리 */
export type BaseRuleConfig = {
  [key in RapportCalcSourceType]: number;
};

export type BonusRuleConfig = {
  emotionTag?: number;
  longMessageThreshold?: number;
  longMessageBonus?: number;
};

export interface RapportRuleConfig {
  base: BaseRuleConfig;
  bonuses?: BonusRuleConfig;
}

/** 계산 입력 */
export interface RapportCalcInput {
  relation: CounselorUserRelationshipInfo;
  source: RapportCalcSource;
  dailyCap?: number;
  rules?: RapportRuleConfig;
}

/** 계산 결과(프리뷰) */
export interface RapportCalcResult {
  plannedAmount: number; // 이번 이벤트에서 계획되는 증가량(캡 적용 후)
  reasons: string[]; // 적용된 기준/보너스/캡 사유
  flags: {
    capped: boolean; // 캡에 의해 깎였는가
  };
}

/** 타입 가드 함수들 */
export const isUserMessageSource = (source: RapportCalcSource): source is UserMessageSource => {
  return source.type === "USER_MESSAGE";
};

export const isTaskCompletedSource = (source: RapportCalcSource): source is TaskCompletedSource => {
  return source.type === "TASK_COMPLETED";
};

export const isSessionTickSource = (source: RapportCalcSource): source is SessionTickSource => {
  return source.type === "SESSION_TICK";
};
