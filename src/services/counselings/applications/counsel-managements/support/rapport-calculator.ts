import {
  RapportCalcInput,
  RapportCalcResult,
  RapportRuleConfig,
} from "~counselings/applications/counsel-managements/types/rapport.type";

import { Injectable } from "@nestjs/common";

export const DEFAULT_RULES: RapportRuleConfig = {
  base: {
    USER_MESSAGE: 1,
    TASK_COMPLETED: 6,
    SESSION_TICK_10M: 2,
    SESSION_TICK_30M: 5,
  },
  bonuses: {
    emotionTag: 1,
    longMessageThreshold: undefined,
    longMessageBonus: undefined,
  },
};

export const DEFAULT_DAILY_CAP = 20;

/**
 * 라포 계산기 - 규칙 기반 점수 산정
 * - 단일 책임: 라포 점수 산정 로직 캡슐화
 * - 정책(룰셋/캡) 주입 가능
 */
@Injectable()
export class RapportCalculator {
  constructor(
    private readonly cap: number,
    private readonly rules: RapportRuleConfig,
  ) {}

  getRules(): RapportRuleConfig {
    return this.rules;
  }

  getDailyCap(): number {
    return this.cap;
  }

  compute(input: RapportCalcInput): RapportCalcResult {
    const { relation, eventType, payload } = input;

    const rules = input.rules ?? this.getRules();
    const dailyCap = input.dailyCap ?? this.getDailyCap();

    // 0) 방어: dailyCap/누적이 비정상이어도 안전하게 처리
    const safeDailyCap = this.clampInt(dailyCap);
    const already = this.clampInt(relation.dailyIncreasedRapport);

    let base = 0;
    const reasons: string[] = [];

    // 1) 베이스 점수
    switch (eventType) {
      case "USER_MESSAGE": {
        base += rules.base.USER_MESSAGE;
        reasons.push(`base(USER_MESSAGE:+${rules.base.USER_MESSAGE})`);

        // 보너스: 감정태그
        if (payload?.hasEmotionTag && rules.bonuses?.emotionTag) {
          base += rules.bonuses.emotionTag;
          reasons.push(`bonus(emotion:+${rules.bonuses.emotionTag})`);
        }
        // 보너스: 긴 메시지
        const th = rules.bonuses?.longMessageThreshold;
        const bonus = rules.bonuses?.longMessageBonus;
        const len = payload?.textLength ?? 0;
        if (th && bonus && len >= th) {
          base += bonus;
          reasons.push(`bonus(longMessage>=${th}:+${bonus})`);
        }
        break;
      }

      case "TASK_COMPLETED": {
        base += rules.base.TASK_COMPLETED;
        reasons.push(`base(TASK_COMPLETED:+${rules.base.TASK_COMPLETED})`);
        // 필요 시 payload.taskKind별 보정은 여기서 확장
        break;
      }

      case "SESSION_TICK": {
        // 10/30분 구간 우선 지원
        const m = payload?.minutesElapsed ?? 0;
        if (m >= 30 && rules.base.SESSION_TICK_30M) {
          base += rules.base.SESSION_TICK_30M;
          reasons.push(`base(SESSION_TICK_30M:+${rules.base.SESSION_TICK_30M})`);
        } else if (m >= 10 && rules.base.SESSION_TICK_10M) {
          base += rules.base.SESSION_TICK_10M;
          reasons.push(`base(SESSION_TICK_10M:+${rules.base.SESSION_TICK_10M})`);
        }
        break;
      }
    }

    base = this.clampInt(base);

    // 2) 일일 캡 적용
    const remaining = Math.max(0, safeDailyCap - already);
    const plannedAmount = Math.max(0, Math.min(base, remaining));
    const capped = plannedAmount < base;
    if (capped) reasons.push(`capped:${base}→${plannedAmount}`);

    // 3) 결과 구성
    return {
      plannedAmount,
      reasons,
      flags: { capped },
    };
  }

  private clampInt(n: number): number {
    if (!Number.isFinite(n)) return 0;
    const k = Math.trunc(n);
    return Number.isSafeInteger(k) ? Math.max(0, k) : 0;
  }
}
