// langchain-assistant-agent.ts

import { AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { Tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { Inject, Injectable, Logger } from "@nestjs/common";
import {
  AgentConfig,
  AssistantAgent,
  ChatRequest,
  ChatResponse,
} from "~common/support/assistant-agents/assistant-agent";
import { AGENT_CONFIG, TOOLS } from "~common/support/assistant-agents/assistant-agent.module";
import { Observable, Subject } from "rxjs";

@Injectable()
export class LangchainAssistantAgent implements AssistantAgent {
  private readonly logger = new Logger(LangchainAssistantAgent.name);
  private readonly agentTools: Tool[];
  private readonly agentModel: ChatOpenAI;
  private readonly maxToolCalls: number;

  constructor(@Inject(TOOLS) tools: Tool[], @Inject(AGENT_CONFIG) config: AgentConfig) {
    this.logger.log("Initializing LangchainAgent...");

    // 설정값 적용
    this.maxToolCalls = config.maxToolCalls;

    // Define the tools for the agent to use
    this.agentTools = tools;

    this.agentModel = new ChatOpenAI({
      temperature: config.temperature,
      modelName: config.modelName,
      streaming: config.streaming,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // 모델에 툴 바인딩
    if (this.agentTools.length > 0) {
      this.agentModel.bindTools(this.agentTools);
    }

    this.logger.log("LangchainAgent initialized successfully");
  }

  /**
   * 단일 요청-응답 처리 (임시 메모리 사용)
   */
  async call(request: ChatRequest): Promise<ChatResponse> {
    const { conversationId, message, systemPrompt, useTools = true } = request;

    this.logger.log(`Processing call for conversation: ${conversationId}`);
    this.logger.log(`User message length: ${message.length}`);

    // 임시 메모리: 이 call 실행 동안만 사용되는 메시지 배열
    const callMessages: BaseMessage[] = [];

    // 시스템 메시지 추가 (있는 경우)
    if (systemPrompt) {
      callMessages.push(new SystemMessage(systemPrompt));
    }

    // 사용자 메시지 추가
    callMessages.push(new HumanMessage(message));

    try {
      let toolCallCount = 0;
      const currentMessages = [...callMessages];

      while (toolCallCount < this.maxToolCalls) {
        // LLM 호출
        const response = await this.agentModel.invoke(currentMessages);

        // AIMessage 타입 확인
        if (!(response instanceof AIMessage)) {
          throw new Error("Expected AIMessage from model");
        }

        // Tool calls 확인
        if (useTools && response.tool_calls && response.tool_calls.length > 0) {
          toolCallCount++;
          this.logger.log(`Tool call iteration ${toolCallCount} for conversation: ${conversationId}`);

          // 현재 AI 메시지를 메시지 히스토리에 추가
          currentMessages.push(response);

          // 각 툴콜 실행
          const toolMessages: ToolMessage[] = [];
          for (const toolCall of response.tool_calls) {
            this.logger.log(`Tool call: ${toolCall.name} with parameters: [${JSON.stringify(toolCall.args)}]`);

            try {
              // 툴 찾기
              const tool = this.agentTools.find((t) => t.name === toolCall.name);
              if (!tool) {
                throw new Error(`Tool ${toolCall.name} not found`);
              }

              // 툴 실행
              const toolResult = await tool.invoke(toolCall.args);

              // ToolMessage 생성
              toolMessages.push(
                new ToolMessage({
                  content: typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult),
                  tool_call_id: toolCall.id!,
                }),
              );
            } catch (error) {
              this.logger.error(`Error executing tool ${toolCall.name}:`, error);
              toolMessages.push(
                new ToolMessage({
                  content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                  tool_call_id: toolCall.id!,
                }),
              );
            }
          }

          // 툴 결과를 메시지 히스토리에 추가
          currentMessages.push(...toolMessages);
          continue;
        }

        // 툴콜이 없으면 최종 응답 반환
        return {
          conversationId,
          content: typeof response.content === "string" ? response.content : JSON.stringify(response.content),
          isComplete: true,
          toolCalls: response.tool_calls,
        };
      }

      if (toolCallCount >= this.maxToolCalls) {
        this.logger.warn(`Maximum tool call iterations reached for conversation: ${conversationId}`);
      }

      throw new Error("Maximum tool call iterations exceeded");
    } catch (error) {
      this.logger.error(`Error processing call for conversation ${conversationId}:`, error);
      throw error;
    }
  }

  /**
   * 스트리밍 응답 처리 (단일 call용)
   */
  callStream(request: ChatRequest): Observable<ChatResponse> {
    const { conversationId, message, systemPrompt } = request;
    const subject = new Subject<ChatResponse>();

    this.logger.log(`Processing stream call for conversation: ${conversationId}`);

    (async () => {
      try {
        // 임시 메모리: 스트리밍 동안만 사용
        const streamMessages: BaseMessage[] = [];

        if (systemPrompt) {
          streamMessages.push(new SystemMessage(systemPrompt));
        }
        streamMessages.push(new HumanMessage(message));

        // 스트리밍 모델로 호출
        const stream = await this.agentModel.stream(streamMessages);

        let accumulatedContent = "";

        for await (const chunk of stream) {
          const content = chunk.content;
          if (content) {
            accumulatedContent += content;

            // 중간 스트리밍 응답 전송
            subject.next({
              conversationId,
              content: content.toString(),
              isComplete: false,
            });
          }
        }

        // 최종 응답
        subject.next({
          conversationId,
          content: "",
          isComplete: true,
        });

        subject.complete();
      } catch (error) {
        this.logger.error(`Error in stream call for conversation ${conversationId}:`, error);
        subject.error(error);
      }
    })();

    return subject.asObservable();
  }

  /**
   * 헬스 체크
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.agentModel.invoke([new HumanMessage("Hello")]);
      return true;
    } catch (error) {
      this.logger.error("Health check failed:", error);
      return false;
    }
  }
}
