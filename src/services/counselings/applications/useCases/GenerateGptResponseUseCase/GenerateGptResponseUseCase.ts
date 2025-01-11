import { UseCase } from "~/src/shared/core/applications/UseCase";
import { GenerateGptResponseUseCaseRequest } from "~counselings/applications/useCases/GenerateGptResponseUseCase/dto/GenerateGptResponse.request";
import { GenerateGptResponseUseCaseResponse } from "~counselings/applications/useCases/GenerateGptResponseUseCase/dto/GenerateGptResponse.response";

import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class GenerateGptResponseUseCase
  implements UseCase<GenerateGptResponseUseCaseRequest, GenerateGptResponseUseCaseResponse>
{
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
