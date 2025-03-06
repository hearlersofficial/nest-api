import { UseCase } from "~shared/core/applications/UseCase";
import { isDefined } from "~shared/utils/Validate.utils";
import { ContextService } from "~counselings/aggregates/contexts/applications/context.service";
import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionService } from "~counselings/aggregates/instructions/applications/instruction.service";
import { PersonaService } from "~counselings/aggregates/personas/applications/persona.service";
import { ToneService } from "~counselings/aggregates/tones/applications/tone.service";
import { MakeSystemPromptUseCaseRequest } from "~counselings/applications/useCases/MakeSystemPromptUseCase/dto/MakeSystemPrompt.request";
import { MakeSystemPromptUseCaseResponse } from "~counselings/applications/useCases/MakeSystemPromptUseCase/dto/MakeSystemPrompt.response";

import { Injectable } from "@nestjs/common";
import { ChatCompletionSystemMessageParam } from "openai/resources";

@Injectable()
export class MakeSystemPromptUseCase
  implements UseCase<MakeSystemPromptUseCaseRequest, MakeSystemPromptUseCaseResponse>
{
  constructor(
    private readonly personaService: PersonaService,
    private readonly contextService: ContextService,
    private readonly instructionService: InstructionService,
    private readonly instructionItemService: InstructionItemService,
    private readonly toneService: ToneService,
  ) {}

  async execute(request: MakeSystemPromptUseCaseRequest): Promise<MakeSystemPromptUseCaseResponse> {
    const { counselTechnique, counselor } = request;

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
    const instructionItems = await this.instructionItemService.findMany({
      ids: instruction.instructionMaps.map((map) => map.instructionItemId),
    });

    if (!isDefined(counselTechnique.toneId)) {
      return { ok: false, error: "Tone not found" };
    }
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
