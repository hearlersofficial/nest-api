import { UseCase } from "~shared/core/applications/UseCase";
import { MakeSystemPromptUseCaseRequest, MakeSystemPromptUseCaseResponse } from "~counselings/applications/use-cases/dtos/make-system-prompt.dto";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";

import { Injectable } from "@nestjs/common";
import { ChatCompletionSystemMessageParam } from "openai/resources";

@Injectable()
export class MakeSystemPromptUseCase implements UseCase<MakeSystemPromptUseCaseRequest, MakeSystemPromptUseCaseResponse> {
  constructor(
    private readonly personaPromptService: PersonaPromptsService,
    private readonly tonePromptService: TonePromptsService,
    private readonly counselTechniqueService: CounselTechniquesService,
  ) {}

  async execute(request: MakeSystemPromptUseCaseRequest): Promise<MakeSystemPromptUseCaseResponse> {
    const { personaPromptId, tonePromptId, counselTechniqueId, userId } = request;

    const persona = (await this.personaPromptService.getOne({ personaPromptId })).body;
    const tone = (await this.tonePromptService.getOne({ tonePromptId })).body;
    const counselTechnique = await this.counselTechniqueService.getOne({ counselTechniqueId });
    const context = counselTechnique.context;
    const instruction = counselTechnique.instruction;

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
