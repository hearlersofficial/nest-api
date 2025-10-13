import {
  isSessionTickSource,
  isTaskCompletedSource,
  isUserMessageSource,
  RapportCalcInput,
  RapportCalcResult,
  RapportRuleConfig,
} from "~counselings/domains/counselor-user-relationships/types/rapport.type";

import { Injectable } from "@nestjs/common";

export const DEFAULT_RULES: RapportRuleConfig = {
  base: {
    USER_MESSAGE: 1,
    TASK_COMPLETED: 6,
    SESSION_TICK: 0,
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
    const { relation, source } = input;

    const rules = input.rules ?? this.getRules();
    const dailyCap = input.dailyCap ?? this.getDailyCap();

    // 0) 방어: dailyCap/누적이 비정상이어도 안전하게 처리
    const safeDailyCap = this.clampInt(dailyCap);
    const already = this.clampInt(relation.dailyIncreasedRapport);

    let base = 0;
    const reasons: string[] = [];

    // 1) 베이스 점수
    if (isUserMessageSource(source)) {
      base += rules.base.USER_MESSAGE;
      reasons.push(`base:USER_MESSAGE(${rules.base.USER_MESSAGE})`);

      // 보너스: 감정태그
      if (source.payload.hasEmotionTag && rules.bonuses?.emotionTag) {
        base += rules.bonuses.emotionTag;
        reasons.push(`bonus:emotionTag(${rules.bonuses.emotionTag})`);
      }

      // 보너스: 긴 메시지
      if (
        rules.bonuses?.longMessageThreshold &&
        source.payload.textLength > rules.bonuses.longMessageThreshold &&
        rules.bonuses?.longMessageBonus
      ) {
        base += rules.bonuses.longMessageBonus;
        reasons.push(`bonus:longMessage(${rules.bonuses.longMessageBonus})`);
      }
    } else if (isTaskCompletedSource(source)) {
      base += rules.base.TASK_COMPLETED;
      reasons.push(`base:TASK_COMPLETED(${rules.base.TASK_COMPLETED})`);
    } else if (isSessionTickSource(source)) {
      // SESSION_TICK의 경우, 분 단위 경과 시간에 따라 점수가 다름
      const mins = source.payload.minutesElapsed;
      const tickScore = this.calculateSessionTickScore(mins);

      if (tickScore > 0) {
        base += tickScore;
        reasons.push(`base:SESSION_TICK(${tickScore})`);
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

  private calculateSessionTickScore(minutes: number): number {
    // 30분 이상이면 5점, 10분 이상이면 2점
    if (minutes >= 30) {
      return 5;
    } else if (minutes >= 10) {
      return 2;
    }
    return 0;
  }

  private clampInt(n: number): number {
    if (!Number.isFinite(n)) return 0;
    const k = Math.trunc(n);
    return Number.isSafeInteger(k) ? Math.max(0, k) : 0;
  }
}
