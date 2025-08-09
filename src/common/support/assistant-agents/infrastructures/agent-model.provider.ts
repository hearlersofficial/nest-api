// src/common/support/assistant-agents/infrastructures/agent-model.provider.ts

import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { AIMessageChunk } from "@langchain/core/messages";
import { Runnable } from "@langchain/core/runnables";
import { Tool } from "@langchain/core/tools";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { Injectable } from "@nestjs/common";
import { convertAiModelToModelName } from "~common/shared/utils/ai-model";

export type AgentRunnable = Runnable<BaseLanguageModelInput, AIMessageChunk, ChatOpenAICallOptions>;

@Injectable()
export class AgentModelProvider {
  private readonly modelCache: Record<string, AgentRunnable> = {};

  getModel(tools?: Tool[], aiModel?: AiModel, temperature?: number, streaming: boolean = false): AgentRunnable {
    const modelName = convertAiModelToModelName(aiModel) ?? "gpt-4o-mini";
    const finalTemperature = temperature ?? 0;
    const cacheKey = this.generateCacheKey(modelName, finalTemperature, streaming, tools);

    if (this.modelCache[cacheKey]) {
      return this.modelCache[cacheKey];
    }

    const newModel = new ChatOpenAI({
      modelName,
      temperature: finalTemperature,
      streaming,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const runnable = tools && tools.length > 0 ? newModel.bindTools(tools) : newModel;
    this.modelCache[cacheKey] = runnable;
    return runnable;
  }

  private generateCacheKey(modelName: string, temperature: number, streaming: boolean, tools?: Tool[]): string {
    const toolNames = tools?.map((t) => t.name).join(",") ?? "";
    return `${modelName}-${temperature}-${streaming}-${toolNames}`;
  }
}
