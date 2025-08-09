// langchain-assistant-agent.ts

import { ToolExecutor } from "./tool.executor";
import { ToolCall } from "@langchain/core/dist/messages/tool";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Injectable, Logger } from "@nestjs/common";
import { AssistantAgent, ChatRequest, ChatResponse } from "~common/support/assistant-agents/assistant-agent";
import { AgentModelProvider } from "~common/support/assistant-agents/infrastructures/agent-model.provider";
import { Observable, Subject } from "rxjs";

const DEFAULT_MAX_TOOL_CALLS = 5;

@Injectable()
export class LangchainAssistantAgent implements AssistantAgent {
  private readonly logger = new Logger(LangchainAssistantAgent.name);

  constructor(
    private readonly modelProvider: AgentModelProvider,
    private readonly toolExecutor: ToolExecutor,
  ) {
    this.logger.log("Initializing LangchainAssistantAgent...");
  }

  async call(request: ChatRequest): Promise<ChatResponse> {
    const {
      conversationId,
      message,
      systemPrompt,
      useTools = true,
      tools = [],
      aiModel,
      temperature,
      maxToolCalls = DEFAULT_MAX_TOOL_CALLS,
    } = request;
    this.logger.log(
      `Processing call for conversation: ${conversationId}
      systemPrompt: ${systemPrompt}
      message: ${message}
      tools: ${tools}
      aiModel: ${aiModel}
      temperature: ${temperature}
      maxToolCalls: ${maxToolCalls}`,
    );
    this.logger.log(`System prompt: ${systemPrompt}`);
    this.logger.log(`Message: ${message}`);
    this.logger.log(`Tools: ${tools}`);
    this.logger.log(`AI Model: ${aiModel}`);
    this.logger.log(`Temperature: ${temperature}`);
    this.logger.log(`Max tool calls: ${maxToolCalls}`);

    const callMessages: BaseMessage[] = [];
    if (systemPrompt) callMessages.push(new SystemMessage(systemPrompt));
    callMessages.push(new HumanMessage(message));

    const agentModel = this.modelProvider.getModel(tools, aiModel, temperature);
    let toolCallCount = 0;

    while (toolCallCount < maxToolCalls) {
      const response = await agentModel.invoke(callMessages);

      if (useTools && response.tool_calls && response.tool_calls.length > 0) {
        toolCallCount++;
        this.logger.log(`Tool call iteration ${toolCallCount} for conversation: ${conversationId}`);
        callMessages.push(response);
        const toolMessages = await this.toolExecutor.execute(response.tool_calls as ToolCall[], tools);
        callMessages.push(...toolMessages);
      } else {
        return {
          conversationId,
          content: typeof response.content === "string" ? response.content : JSON.stringify(response.content),
          isComplete: true,
          toolCalls: response.tool_calls,
        };
      }
    }

    this.logger.warn(`Maximum tool call iterations reached for conversation: ${conversationId}`);
    throw new Error("Maximum tool call iterations exceeded");
  }

  callStream(request: ChatRequest): Observable<ChatResponse> {
    const { conversationId, message, systemPrompt, tools, aiModel, temperature } = request;
    const subject = new Subject<ChatResponse>();
    this.logger.log(`Processing stream call for conversation: ${conversationId}`);

    (async () => {
      try {
        const streamMessages: BaseMessage[] = [];
        if (systemPrompt) streamMessages.push(new SystemMessage(systemPrompt));
        streamMessages.push(new HumanMessage(message));

        const agentModel = this.modelProvider.getModel(tools, aiModel, temperature, true);
        const stream = await agentModel.stream(streamMessages);

        for await (const chunk of stream) {
          if (chunk.content) {
            subject.next({
              conversationId,
              content: chunk.content.toString(),
              isComplete: false,
            });
          }
        }

        subject.next({ conversationId, content: "", isComplete: true });
        subject.complete();
      } catch (error) {
        this.logger.error(`Error in stream call for conversation ${conversationId}:`, error);
        subject.error(error);
      }
    })();

    return subject.asObservable();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const model = this.modelProvider.getModel();
      await model.invoke([new HumanMessage("Hello")]);
      return true;
    } catch (error) {
      this.logger.error("Health check failed:", error);
      return false;
    }
  }
}
