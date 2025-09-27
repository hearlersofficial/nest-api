import { CounselorUserRelationshipInfo } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationship-info";

import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

/** 이벤트 종류 */
export type RapportEventType = "USER_MESSAGE" | "TASK_COMPLETED" | "SESSION_TICK";

/** 이벤트별 단순 페이로드 */
export interface RapportEventPayload {
  // USER_MESSAGE
  hasEmotionTag?: boolean;
  textLength?: number;
  // SESSION_TICK
  minutesElapsed?: number;
  // TASK_COMPLETED
  taskKind?: string;
}

/** 규칙/정책 정의 */
export interface RapportRuleConfig {
  base: {
    USER_MESSAGE: number;
    TASK_COMPLETED: number;
    SESSION_TICK_10M: number;
    SESSION_TICK_30M: number;
  };
  bonuses?: {
    emotionTag?: number;
    longMessageThreshold?: number;
    longMessageBonus?: number;
  };
}

/** 계산 입력 */
export interface RapportCalcInput {
  relation: CounselorUserRelationshipInfo;
  eventType: RapportEventType;
  payload?: RapportEventPayload;
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
