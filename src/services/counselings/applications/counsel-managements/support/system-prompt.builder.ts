import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export interface SystemPromptBuildParams {
  personaPromptId: string;
  tonePromptId: string;
  counselTechnique: CounselTechniqueInfo;
}

/**
 * 시스템 프롬프트 생성을 담당하는 서비스
 * 단일 책임: 다양한 프롬프트 구성 요소를 조합하여 최종 시스템 프롬프트 생성
 */
@Injectable()
export class SystemPromptBuilder {
  constructor(
    private readonly personaPromptService: PersonaPromptsService,
    private readonly tonePromptService: TonePromptsService,
  ) {}

  /**
   * 시스템 프롬프트 구성 요소들을 가져와서 최종 프롬프트 생성
   * @param params 프롬프트 빌드 파라미터
   * @returns 완성된 시스템 프롬프트
   */
  async buildSystemPrompt(params: SystemPromptBuildParams): Promise<string> {
    const [personaResult, toneResult] = await Promise.all([
      this.personaPromptService.getOne({
        personaPromptId: new UniqueEntityId(params.personaPromptId),
      }),
      this.tonePromptService.getOne({
        tonePromptId: new UniqueEntityId(params.tonePromptId),
      }),
    ]);

    const persona = personaResult.body;
    const tone = toneResult.body;
    const context = params.counselTechnique.context;
    const instruction = params.counselTechnique.instruction;

    const systemPrompt = `
<Persona>
${persona}
<Context>
${context}
<Instruction>
${instruction}
<Tone>
${tone}
`;
    return systemPrompt;
  }
}
