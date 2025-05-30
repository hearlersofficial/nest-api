import { ASSISTANT_AGENT } from "~counselings/domains/assistant-agents/assistant-agent";
import { LangchainAssistantAgent } from "~counselings/domains/assistant-agents/infrastructures/langchain-assistant-agent";

import { Tool } from "@langchain/core/tools";
import { DynamicModule, Module } from "@nestjs/common";

export const TOOLS = Symbol("TOOLS");

@Module({})
export class AssistantAgentModule {
  // NOTE: 편의성을 위해 라이브러리의 툴을 직접 사용합니다.
  // 이 과정에서 랭체인의 의존성이 외부에 노출되기에 좋지 않은 모듈화입니다만,
  // Spring 처럼 강력한 프레임워크 기반 추상화를 제공해주지 않고, 직접 구현하는게 지나친 오버엔지니어링이라 이렇게 사용합니다.
  static forRoot(tools: Tool[]): DynamicModule {
    return {
      module: AssistantAgentModule,
      providers: [
        {
          provide: TOOLS,
          useValue: tools,
        },
        {
          provide: ASSISTANT_AGENT,
          useClass: LangchainAssistantAgent,
        },
      ],
      exports: [ASSISTANT_AGENT],
    };
  }
}
