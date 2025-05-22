import { UseCase } from "~shared/core/applications/UseCase";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GenerateGptResponseUseCaseRequest, GenerateGptResponseUseCaseResponse } from "~counselings/applications/use-cases/dtos/generate-gpt-response.dto";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class GenerateGptResponseUseCase implements UseCase<GenerateGptResponseUseCaseRequest, GenerateGptResponseUseCaseResponse> {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }

  async execute(request: GenerateGptResponseUseCaseRequest): Promise<GenerateGptResponseUseCaseResponse> {
    const { prompts, model } = request;
    const completion = await this.openai.chat.completions.create({
      model: this.getModel(model),
      messages: prompts,
      temperature: 1,
    });
    const response = completion?.choices[0]?.message?.content;
    if (!response) {
      return {
        ok: false,
        error: "응답 생성에 실패했습니다.",
      };
    }

    return {
      ok: true,
      response,
    };
  }

  private getModel(model: GPTModel): OpenAI.ChatModel {
    switch (model) {
      case GPTModel.GPT_3_5_TURBO:
        return "gpt-3.5-turbo";
      case GPTModel.GPT_4:
        return "gpt-4";
      case GPTModel.GPT_4O:
        return "gpt-4o";
      default:
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "지원하지 않는 GPT 모델입니다.");
    }
  }
}
