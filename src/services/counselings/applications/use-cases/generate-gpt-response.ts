import { UseCase } from "~shared/core/applications/UseCase";
import { GenerateGptResponseUseCaseRequest, GenerateGptResponseUseCaseResponse } from "~counselings/applications/use-cases/dtos/generate-gpt-response.dto";

import { Injectable } from "@nestjs/common";
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
    const { prompts } = request;
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o",
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
}
