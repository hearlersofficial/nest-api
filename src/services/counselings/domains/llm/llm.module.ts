import { LlmClient } from "~counselings/domains/llm/llm.client";
import { LlmService } from "~counselings/domains/llm/llm.service";
import { LlmModelManager } from "~counselings/domains/llm/llm-model-manager";
import { OpenAILlmClient } from "~counselings/infrastructures/llm/openai-llm.client";

import { Module } from "@nestjs/common";

@Module({
  providers: [
    LlmService,
    LlmModelManager,
    {
      provide: LlmClient,
      useClass: OpenAILlmClient,
    },
  ],
  exports: [LlmService],
})
export class LlmModule {}
