import { UseCase } from "~shared/core/applications/UseCase";
import { ContextService } from "~counselings/aggregates/contexts/applications/context.service";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";
import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { InstructionService } from "~counselings/aggregates/instructions/applications/instruction.service";
import { PersonaService } from "~counselings/aggregates/personas/applications/persona.service";
import { Personas } from "~counselings/aggregates/personas/domain/personas";
import { ToneService } from "~counselings/aggregates/tones/applications/tone.service";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import { MakeSystemPromptUseCaseRequest } from "~counselings/applications/useCases/MakeSystemPromptUseCase/dto/MakeSystemPrompt.request";
import { MakeSystemPromptUseCaseResponse } from "~counselings/applications/useCases/MakeSystemPromptUseCase/dto/MakeSystemPrompt.response";

import { Injectable } from "@nestjs/common";
import { ChatCompletionSystemMessageParam } from "openai/resources";

@Injectable()
export class MakeSystemPromptUseCase implements UseCase<MakeSystemPromptUseCaseRequest, MakeSystemPromptUseCaseResponse> {
  constructor(
    private readonly personaService: PersonaService,
    private readonly contextService: ContextService,
    private readonly instructionService: InstructionService,
    private readonly instructionItemService: InstructionItemService,
    private readonly toneService: ToneService,
  ) {}

  async execute(request: MakeSystemPromptUseCaseRequest): Promise<MakeSystemPromptUseCaseResponse> {
    const { counselTechnique, counselor, userId } = request;

    const personas = await this.personaService.findMany({ counselorId: counselor.id });
    if (personas.length === 0) {
      return { ok: false, error: "Personas not found" };
    }
    // TODO: persona 여러개 처리
    const persona = personas[0];

    const context = await this.contextService.findOne(counselTechnique.contextId);
    if (!context) {
      return { ok: false, error: "Context not found" };
    }

    const instruction = await this.instructionService.findOne(counselTechnique.instructionId);
    if (!instruction) {
      return { ok: false, error: "Instruction not found" };
    }
    const instructionItems = await this.instructionItemService.findMany({ ids: instruction.instructionMaps.map((map) => map.instructionItemId) });

    const tone = await this.toneService.findOne(counselTechnique.toneId);
    if (!tone) {
      return { ok: false, error: "Tone not found" };
    }

    const personaPromptResult = persona.getPrompt();
    if (personaPromptResult.isFailure) {
      return {
        ok: false,
        error: personaPromptResult.error,
      };
    }
    const personaPrompt = personaPromptResult.value;

    // TODO: userId 이용해서 contextVariables 구성
    // context.placeholders 값 조회 필요
    const contextVariables: Record<string, string> = {};

    const contextPromptResult = context.getPrompt(contextVariables);
    if (contextPromptResult.isFailure) {
      return {
        ok: false,
        error: contextPromptResult.error,
      };
    }
    const contextPrompt = contextPromptResult.value;

    const instructionItemPrompts = instructionItems.map((item, index) => `${index + 1}. ${item.body}`).join("\n");

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

  private createPrompt(
    persona: Personas,
    context: Contexts,
    instructionItems: InstructionItems[],
    tone: Tones,
    contextVariables?: Record<string, string>,
  ): string {
    const personaPromptResult = persona.getPrompt();
    if (personaPromptResult.isFailure) {
      return personaPromptResult.error;
    }
    const personaPrompt = personaPromptResult.value;

    const contextPromptResult = context.getPrompt(contextVariables);
    if (contextPromptResult.isFailure) {
      return contextPromptResult.error;
    }
    const contextPrompt = contextPromptResult.value;

    const instructionItemPrompts = instructionItems.map((item, index) => `${index + 1}. ${item.body}`).join("\n");

    const tonePromptResult = tone.getPrompt();
    if (tonePromptResult.isFailure) {
      return tonePromptResult.error;
    }
    const tonePrompt = tonePromptResult.value;

    return `${personaPrompt}\n${contextPrompt}\n${instructionItemPrompts}\n${tonePrompt}`;
  }
}
