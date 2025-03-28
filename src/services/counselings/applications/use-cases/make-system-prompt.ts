import { UseCase } from "~shared/core/applications/UseCase";
import { MakeSystemPromptUseCaseRequest, MakeSystemPromptUseCaseResponse } from "~counselings/applications/use-cases/dtos/make-system-prompt.dto";
import { TonesService } from "~counselings/domains/tones/tones.service";

import { Injectable } from "@nestjs/common";
import { ChatCompletionSystemMessageParam } from "openai/resources";

@Injectable()
export class MakeSystemPromptUseCase implements UseCase<MakeSystemPromptUseCaseRequest, MakeSystemPromptUseCaseResponse> {
  constructor(private readonly toneService: TonesService) {}

  async execute(request: MakeSystemPromptUseCaseRequest): Promise<MakeSystemPromptUseCaseResponse> {
    const { counselTechnique, counselor, userId } = request;

    const persona = counselor.persona.body;

    const context = counselTechnique.context;

    const instruction = counselTechnique.instruction;

    const tone = (await this.toneService.getOne({ toneId: counselTechnique.toneId })).body;

    // TODO: contextVariables 처리

    // 각 내용을 태그로 감싸기
    const personaPrompt = `<persona>\n${persona}`;
    const contextPrompt = `<context>\n${context}`;
    const instructionPrompt = `<instruction>\n${instruction}`;
    const tonePrompt = `<tone>\n${tone}`;

    const content = [personaPrompt, contextPrompt, instructionPrompt, tonePrompt].join("\n\n");

    const prompt: ChatCompletionSystemMessageParam = {
      role: "system",
      content,
    };

    return { ok: true, prompt };
  }
}
