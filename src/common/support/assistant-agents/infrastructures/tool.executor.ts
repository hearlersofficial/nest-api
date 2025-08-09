// src/common/support/assistant-agents/infrastructures/tool.executor.ts

import { ToolCall } from "@langchain/core/dist/messages/tool";
import { ToolMessage } from "@langchain/core/messages";
import { Tool } from "@langchain/core/tools";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ToolExecutor {
  private readonly logger = new Logger(ToolExecutor.name);

  async execute(toolCalls: ToolCall[], tools: Tool[]): Promise<ToolMessage[]> {
    this.logger.log(`Executing ${toolCalls.length} tool calls.`);
    return await Promise.all(
      toolCalls.map(async (toolCall) => {
        this.logger.log(`Tool call: ${toolCall.name} with parameters: [${JSON.stringify(toolCall.args)}]`);
        try {
          const tool = tools.find((t) => t.name === toolCall.name);
          if (!tool) throw new Error(`Tool ${toolCall.name} not found`);

          const toolResult = await tool.invoke(toolCall.args);
          return new ToolMessage({
            content: typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult),
            tool_call_id: toolCall.id!,
          });
        } catch (error) {
          this.logger.error(`Error executing tool ${toolCall.name}:`, error);
          return new ToolMessage({
            content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            tool_call_id: toolCall.id!,
          });
        }
      }),
    );
  }
}
