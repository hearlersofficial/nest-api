import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { CounselContexts, CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";

import { Injectable } from "@nestjs/common";

export interface AnalysisMetadata {
  /** 분석에 사용된 메시지 수 */
  messageCount: number;
  /** 분석 소요 시간 (ms) */
  processingTime: number;
  /** 분석 실패 이유 (실패 시) */
  failureReason?: string;
  /** 간단한 품질 지표 */
  quality: "GOOD" | "PARTIAL" | "POOR";
}

export interface AnalysisResult {
  /** 업데이트할 맥락 정보 */
  updates: Partial<CounselContextsProps>;
  /** 분석 메타데이터 */
  metadata: AnalysisMetadata;
}

export interface DomainAnalyzer {
  readonly domain: ContextDomain;
  analyze: (counselContext: CounselContexts) => Promise<AnalysisResult>;
}

@Injectable()
export abstract class BaseDomainAnalyzer implements DomainAnalyzer {
  abstract readonly domain: ContextDomain;
  abstract analyze(counselContext: CounselContexts): Promise<AnalysisResult>;

  /**
   * 분석 결과를 메타데이터와 함께 생성하는 헬퍼 메서드
   */
  protected createResult(
    updates: Partial<CounselContextsProps>,
    messageCount: number,
    processingTime: number,
    quality: "GOOD" | "PARTIAL" | "POOR" = "GOOD",
  ): AnalysisResult {
    return {
      updates,
      metadata: {
        messageCount,
        processingTime,
        quality,
      },
    };
  }

  /**
   * 실패 결과를 생성하는 헬퍼 메서드
   */
  protected createFailureResult(failureReason: string, messageCount: number, processingTime: number): AnalysisResult {
    return {
      updates: {},
      metadata: {
        messageCount,
        processingTime,
        failureReason,
        quality: "POOR",
      },
    };
  }

  /**
   * 간단한 품질 판단: 추출된 필드 수와 응답 유효성 기반
   */
  protected assessQuality(updates: Partial<CounselContextsProps>, rawResponse: string): "GOOD" | "PARTIAL" | "POOR" {
    const fieldCount = Object.keys(updates).length;
    const hasValidJson = this.isValidJson(rawResponse);

    if (fieldCount >= 3 && hasValidJson) return "GOOD";
    if (fieldCount >= 1 && hasValidJson) return "PARTIAL";
    return "POOR";
  }

  /**
   * JSON 유효성 간단 체크
   */
  private isValidJson(rawResponse: string): boolean {
    try {
      const startIndex = rawResponse.indexOf("{");
      const endIndex = rawResponse.lastIndexOf("}") + 1;
      if (startIndex === -1 || endIndex === 0) return false;
      JSON.parse(rawResponse.slice(startIndex, endIndex));
      return true;
    } catch {
      return false;
    }
  }
}
