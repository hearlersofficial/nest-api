import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";

import { Injectable } from "@nestjs/common";

export interface TechniqueEvaluationSystemPromptParams {
  currentTechnique: CounselTechniqueInfo;
  nextTechnique: CounselTechniqueInfo;
  messageThreshold: number;
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
   * @param session 상담 세션
   * @returns 완성된 시스템 프롬프트
   */
  async buildSystemPrompt(session: CounselSession): Promise<string> {
    const [personaResult, toneResult] = await Promise.all([
      this.personaPromptService.getOne({
        personaPromptId: session.getCounselorScopedPrompt().personaPromptId,
      }),
      this.tonePromptService.getOne({
        tonePromptId: session.getToneScopedPrompt().tonePromptId,
      }),
    ]);

    const persona = personaResult.body;
    const tone = toneResult.body;
    const context = session.getCurrentTechnique().context;
    const instruction = session.getCurrentTechnique().instruction;

    const systemPrompt = `
<Persona>
${persona}
</Persona>
<Context>
${context}
</Context>
<Instruction>
${instruction}
</Instruction>
<Tone>
${tone}
</Tone>
`;
    return systemPrompt;
  }

  /**
   * 기법 전환 평가용 통합 시스템 프롬프트 생성 (증거 기반, 원자적 특징 산출)
   */
  buildTechniqueEvaluationSystemPrompt(params: TechniqueEvaluationSystemPromptParams): string {
    const { currentTechnique, nextTechnique, messageThreshold } = params;

    return `
You are an expert counseling supervisor. Be concise and output ONLY the required JSON. No markdown, no extra text.

<RULES>
- Use ONLY the provided conversation history (not included here) and technique specs below.
- DO NOT decide or recommend transition; DO NOT compute an overall score. Only extract signals.
 - Be conservative: if evidence is weak or ambiguous, use lower scores.
 - Provide up to 2 short verbatim quotes when present.
 - Use these abstract constructs:
   - completion: how complete the current technique feels.
   - readiness: how ready/motivated the client is to move forward.
   - alignment: conceptual/temporal fit with the next technique now.
</RULES>

<CALIBRATION>
Rubric (0-100): 0-20 minimal, 21-40 weak, 41-60 moderate, 61-80 strong, 81-100 very strong.
</CALIBRATION>

<CURRENT_TECHNIQUE>
Name: ${currentTechnique.name}
Context: ${currentTechnique.context}
Instruction: ${currentTechnique.instruction}
MessageThreshold: ${currentTechnique.messageThreshold}
</CURRENT_TECHNIQUE>

<NEXT_TECHNIQUE>
Name: ${nextTechnique.name}
Context: ${nextTechnique.context}
Instruction: ${nextTechnique.instruction}
</NEXT_TECHNIQUE>

<OUTPUT_JSON_SCHEMA>
{
  "signals": {
    "clinical": {
      "completion": number,
      "readiness": number,
      "alignment": number
    }
  },
  "evidence": [ { "quote": string } ],
  "triggers": [
    "emotionDisclosure"|"affectNamed"|"feelingStated"|"explicitTransitionRequest"|"askToMoveOn"|"currentGoalsDone"|"phaseComplete"
  ]
}
</OUTPUT_JSON_SCHEMA>

<INSTRUCTIONS>
- Return ONLY valid JSON per schema. No markdown.
- Keep quotes short (<= 200 chars) and verbatim.
- messageThreshold is ${messageThreshold}. Fill "signals.clinical" only.
</INSTRUCTIONS>
`;
  }
}
