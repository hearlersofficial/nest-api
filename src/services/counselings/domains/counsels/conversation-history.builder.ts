import { CompressedMessageInfo } from "~counselings/domains/counsels/models/compressed-context.info";
import { CompressedMessages } from "~counselings/domains/counsels/models/compressed-messages";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";

import { Injectable } from "@nestjs/common";

/**
 * 대화 히스토리 구성을 담당하는 서비스
 */
@Injectable()
export class ConversationHistoryBuilder {
  buildHistory(
    messages: CounselMessageInfo[] | CounselMessages[],
    compressedMessages?: CompressedMessageInfo[] | CompressedMessages[],
  ): string {
    const formattedContexts = compressedMessages ? this.formatContexts(compressedMessages) : "";
    const conversationJson = this.buildMessagesJson(
      messages.map((m) => ({ isUserMessage: m.isUserMessage, message: m.message })),
    );

    return [formattedContexts, conversationJson].filter((s) => s && s.trim().length > 0).join("\n\n");
  }

  /**
   * 개별 메시지를 포맷팅
   * @param message 상담 메시지
   * @returns 포맷된 메시지 문자열
   */
  private buildMessagesJson(messages: Array<{ isUserMessage: boolean; message: string }>): string {
    if (messages.length === 0) {
      return "[]";
    }

    const items = messages
      .map((m, idx) => {
        const speaker = m.isUserMessage ? "client" : "counselor";
        const text = JSON.stringify((m.message ?? "").replace(/[\r\n]+/g, " ").trim());
        return `  { "turn": ${idx + 1}, "speaker": "${speaker}", "text": ${text} }`;
      })
      .join(",\n");

    return `[\n${items}\n]`;
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

  /**
   * 압축된 컨텍스트를 포맷팅
   * @param context 압축된 컨텍스트 정보
   * @returns 포맷된 컨텍스트 문자열
   */
  private formatContexts(compressedMessages: CompressedMessageInfo[]): string {
    if (compressedMessages.length === 0) {
      return "";
    }

    const formattedContexts = compressedMessages.map(
      (message) => `[PREVIOUS_SESSION]\n${message.content}\n[/PREVIOUS_SESSION]`,
    );

    return formattedContexts.join("\n\n");
  }

  /**
   * 도메인 모델 메시지 배열을 JSON 포맷 대화 히스토리로 변환
   * @param messages 도메인 모델의 상담 메시지 배열
   */
  buildHistoryFromDomain(messages: CounselMessageInfo[] | CounselMessages[]): string {
    return this.buildMessagesJson(messages.map((m) => ({ isUserMessage: m.isUserMessage, message: m.message })));
  }
}
