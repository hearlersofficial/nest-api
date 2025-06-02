import { OpenAILlmMapper } from "~counselings/domains/llm/infrastructures/mappers/openai.llm.mapper";
import { LlmClient } from "~counselings/domains/llm/llm.client";
import { LlmRequest } from "~counselings/domains/llm/models/llm-request";
import { LlmResponse } from "~counselings/domains/llm/models/llm-response";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class OpenAILlmClient extends LlmClient {
  private openai: OpenAI;

  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }

  async generateResponse(request: LlmRequest[], model: GPTModel): Promise<LlmResponse> {
    const messages = OpenAILlmMapper.toMessageParams(request);
    const completion = await this.openai.chat.completions.create({
      model: OpenAILlmMapper.toOpenAIModel(model),
      messages,
      temperature: 1,
    });
    return OpenAILlmMapper.toLlmResponse(completion);
  }
}
