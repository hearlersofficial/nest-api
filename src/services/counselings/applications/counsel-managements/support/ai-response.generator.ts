import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Tool } from "@langchain/core/tools";
import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent, ChatRequest } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

/**
 * AI 응답 생성을 담당하는 서비스
 * 단일 책임: AssistantAgent를 통한 AI 응답 생성
 */
@Injectable()
export class AIResponseGenerator {
  constructor(
    @Inject(ASSISTANT_AGENT)
    private readonly assistantAgent: AssistantAgent,
  ) {}

  /**
   * AI 응답 생성
   * @param systemPrompt 시스템 프롬프트
   * @param conversationHistory 대화 히스토리
   * @param userMessage 유저 메시지
   * @param counselId 상담 ID (컨버세이션 ID로 사용)
   * @returns AI 생성 응답 텍스트
   */
  async generateResponse(
    systemPrompt: string,
    conversationHistory: string,
    userMessage: string,
    conversationId: string,
    aiModel: AiModel,
    temperature: number,
    tools: Tool[] = [],
  ): Promise<string> {
    const chatRequest: ChatRequest = this.buildChatRequest(
      systemPrompt,
      conversationHistory,
      userMessage,
      conversationId,
      aiModel,
      temperature,
      tools,
    );

    const chatResponse = await this.assistantAgent.call(chatRequest);

    if (!chatResponse.content) {
      throw new Error("AI response generation failed: empty content");
    }

    return chatResponse.content;
  }

  /**
   * ChatRequest 객체 생성
   * @param systemPrompt 시스템 프롬프트
   * @param conversationHistory 대화 히스토리
   * @param userMessage 유저 메시지
   * @param counselId 상담 ID
   * @returns ChatRequest 객체
   */
  private buildChatRequest(
    systemPrompt: string,
    conversationHistory: string,
    userMessage: string,
    conversationId: string,
    aiModel: AiModel,
    temperature: number,
    tools: Tool[],
  ): ChatRequest {
    const fullMessage = `
<ConversationHistory>
${conversationHistory ? conversationHistory : "none"}
</ConversationHistory>
<CurrentUserMessage>
${userMessage}
</CurrentUserMessage>
`;

    return {
      conversationId,
      message: fullMessage,
      systemPrompt,
      useTools: false,
      aiModel,
      temperature,
      tools,
    };
  }
}
