import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";

import { Injectable } from "@nestjs/common";

/**
 * 대화 히스토리 구성을 담당하는 서비스
 * 단일 책임: 메시지 배열을 AI가 이해할 수 있는 포맷으로 변환
 */
@Injectable()
export class ConversationHistoryBuilder {
  /**
   * 메시지 배열을 대화 히스토리 문자열로 변환
   * @param messages 상담 메시지 배열
   * @returns 포맷된 대화 히스토리 문자열
   */
  buildHistory(messages: CounselMessageInfo[]): string {
    if (messages.length === 0) {
      return "";
    }

    return messages.map((message) => this.formatMessage(message)).join("\n\n");
  }

  /**
   * 개별 메시지를 포맷팅
   * @param message 상담 메시지
   * @returns 포맷된 메시지 문자열
   */
  private formatMessage(message: CounselMessageInfo): string {
    const speaker = message.isUserMessage ? "User" : "Assistant";
    return `${speaker}: ${message.message}`;
  }

  /**
   * 최근 N개 메시지만 포함한 히스토리 구성
   * @param messages 상담 메시지 배열
   * @param limit 포함할 메시지 수 (기본값: 20)
   * @returns 제한된 대화 히스토리 문자열
   */
  buildLimitedHistory(messages: CounselMessageInfo[], limit: number = 20): string {
    const recentMessages = messages.slice(-limit);
    return this.buildHistory(recentMessages);
  }
}
