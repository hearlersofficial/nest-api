import { UseCase } from "~shared/core/applications/UseCase";
import { MakeSystemPromptUseCaseRequest, MakeSystemPromptUseCaseResponse } from "~counselings/applications/use-cases/dtos/make-system-prompt.dto";
import { ContextsService } from "~counselings/domains/contexts/contexts.service";
import { InstructionItemsService } from "~counselings/domains/instructionItems/instructionItems.service";
import { InstructionsService } from "~counselings/domains/instructions/instructions.service";
import { TonesService } from "~counselings/domains/tones/tones.service";

import { Injectable } from "@nestjs/common";
import { ChatCompletionSystemMessageParam } from "openai/resources";

@Injectable()
export class MakeSystemPromptUseCase implements UseCase<MakeSystemPromptUseCaseRequest, MakeSystemPromptUseCaseResponse> {
  constructor(
    private readonly contextService: ContextsService,
    private readonly instructionService: InstructionsService,
    private readonly instructionItemService: InstructionItemsService,
    private readonly toneService: TonesService,
  ) {}

  async execute(request: MakeSystemPromptUseCaseRequest): Promise<MakeSystemPromptUseCaseResponse> {
    const { counselTechnique, counselor, userId } = request;

    const persona = counselor.persona;

    const context = await this.contextService.getOne({ contextId: counselTechnique.contextId });

    const instruction = await this.instructionService.getOne({ instructionId: counselTechnique.instructionId });
    const instructionItems = await this.instructionItemService.findMany({
      ids: instruction.instructionMaps.map((map) => map.instructionItemId),
    });

    const tone = await this.toneService.getOne({ toneId: counselTechnique.toneId });

    const personaPromptResult = persona.getPrompt();
    if (personaPromptResult.isFailure) {
      return {
        ok: false,
        error: personaPromptResult.error,
      };
    }
    const personaPrompt = personaPromptResult.value;

    // TODO: userId 이용해서 contextVariables 구성
    // 우선 임시 문자열로 지정
    const contextVariables: Record<string, string> = {
      ...context.placeholders.reduce((acc, placeholder) => {
        acc[placeholder] = "temp";
        return acc;
      }, {} as Record<string, string>),
    };

    const contextPromptResult = context.getPrompt(contextVariables);
    if (contextPromptResult.isFailure) {
      return {
        ok: false,
        error: contextPromptResult.error,
      };
    }
    const contextPrompt = contextPromptResult.value;

    const instructionPromptResult = instruction.getPrompt(instructionItems);
    if (instructionPromptResult.isFailure) {
      return {
        ok: false,
        error: instructionPromptResult.error,
      };
    }
    const instructionItemPrompts = instructionPromptResult.value;

    const tonePromptResult = tone.getPrompt();
    if (tonePromptResult.isFailure) {
      return {
        ok: false,
        error: tonePromptResult.error,
      };
    }
    const tonePrompt = tonePromptResult.value;

    const content = [personaPrompt, contextPrompt, instructionItemPrompts, tonePrompt].join("\n\n");

    const prompt: ChatCompletionSystemMessageParam = {
      role: "system",
      content,
    };

    return { ok: true, prompt };
  }
}
