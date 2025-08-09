import { AgentModelProvider } from "./infrastructures/agent-model.provider";
import { ChatModelFactory } from "./infrastructures/chat-model.factory";
import { ToolExecutor } from "./infrastructures/tool.executor";
import { Module } from "@nestjs/common";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";
import { LangchainAssistantAgent } from "~common/support/assistant-agents/infrastructures/langchain-assistant-agent";

@Module({
  providers: [
    ChatModelFactory,
    AgentModelProvider,
    ToolExecutor,
    {
      provide: ASSISTANT_AGENT,
      useClass: LangchainAssistantAgent,
    },
  ],
  exports: [ASSISTANT_AGENT],
})
export class AssistantAgentModule {}
