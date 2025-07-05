import {
  TechniqueTransitionDecision,
  TechniqueTransitionScore,
} from "~counselings/applications/counsel-managements/types/technique.type";

import { Injectable } from "@nestjs/common";

/**
 * 기법 전환 평가 응답 파싱을 담당하는 서비스
 * 단일 책임: AI 응답의 파싱과 검증
 */
@Injectable()
export class TechniqueEvaluationParser {
  /**
   * AI 응답 파싱
   * @param response AI 응답 텍스트
   * @returns 파싱된 기법 전환 결정
   */
  parseTechniqueEvaluationResponse(response: string): TechniqueTransitionDecision {
    try {
      // JSON 부분만 추출
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // 기본값 설정 및 검증
      const scores: TechniqueTransitionScore = {
        conversationProgressScore: this.validateScore(parsed.scores?.conversationProgressScore),
        userEngagementScore: this.validateScore(parsed.scores?.userEngagementScore),
        goalAchievementScore: this.validateScore(parsed.scores?.goalAchievementScore),
        appropriatenessScore: this.validateScore(parsed.scores?.appropriatenessScore),
        overallScore: this.validateScore(parsed.scores?.overallScore),
        reasoning: parsed.scores?.reasoning || "No reasoning provided",
      };

      return {
        shouldTransition: Boolean(parsed.shouldTransition),
        scores,
        confidence: this.validateScore(parsed.confidence),
      };
    } catch (error) {
      // 파싱 실패 시 기본값 반환
      return {
        shouldTransition: false,
        scores: {
          conversationProgressScore: 0,
          userEngagementScore: 0,
          goalAchievementScore: 0,
          appropriatenessScore: 0,
          overallScore: 0,
          reasoning: `Parsing failed: ${error.message}`,
        },
        confidence: 0,
      };
    }
  }

  /**
   * 점수 검증 (0-100 범위)
   * @param score 점수
   * @returns 검증된 점수
   */
  private validateScore(score: any): number {
    const numScore = Number(score);
    if (isNaN(numScore)) return 0;
    return Math.max(0, Math.min(100, numScore));
  }
}
