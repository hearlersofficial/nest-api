import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

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
        personaPromptId: new UniqueEntityId(session.getCounselorScopedPrompt().personaPromptId),
      }),
      this.tonePromptService.getOne({
        tonePromptId: new UniqueEntityId(session.getToneScopedPrompt().tonePromptId),
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
You are an expert counseling supervisor. Think step-by-step (Chain-of-Thought) but only output JSON. First, internally consider the conversation using counseling psychology constructs, then extract atomic, evidence-backed features to help a downstream rule-based system decide whether to TRANSITION techniques.

<RULES>
- Use ONLY the provided conversation history (not included here) and technique specs below.
- DO NOT decide or recommend transition; DO NOT compute an overall score. Only extract signals.
- Be conservative: if evidence is weak or ambiguous, reflect that in low scores and unmet checklist.
 - Cite at least 2 short verbatim quotes for key signals when present.
 - Use the following constructs:
   - TechniqueCompletion: progress toward current-technique tasks/goals.
   - NextTechniqueFit: conceptual/temporal fit for moving to the next technique now.
   - AllianceStrength: quality of therapeutic alliance (bond, task, goal agreement).
   - ClientReadiness: readiness/motivation/insight to proceed.
   - RiskStability: safety and stability (higher means safer, more stable).
</RULES>

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
    "conversationProgress": number,
    "userEngagement": number,
    "goalAchievement": {
      "percentMet": number,
      "checklist": [ { "name": string, "met": boolean, "quote": string } ]
    },
    "appropriateness": number,
    "clinical": {
      "techniqueCompletion": number,
      "nextTechniqueFit": number,
      "allianceStrength": number,
      "clientReadiness": number,
      "riskStability": number
    }
  },
  "evidence": [                       // short verbatim quotes with tags
    { "quote": string, "tag": "progress"|"engagement"|"goal"|"appropriateness"|"alliance"|"readiness"|"fit"|"stability" }
  ],
  "redFlags": [string],               // safety/clinical concerns (if any)
  "safety": { "riskLevel": number }  // 0-100, crisis or risk assessment
}
</OUTPUT_JSON_SCHEMA>

<INSTRUCTIONS>
- Return ONLY valid JSON per schema. No markdown.
- Keep quotes short (<= 200 chars) and verbatim.
- If unsure, lower scores and mark checklist items as unmet.
- messageThreshold is ${messageThreshold}; reflect it implicitly in conversationProgress and goalAchievement.
 - messageThreshold is ${messageThreshold}; reflect it implicitly in conversationProgress and goalAchievement.
 - Derive clinical signals under "signals.clinical" explicitly.
</INSTRUCTIONS>
`;
  }

  /**
   * 상담 맥락 압축용 시스템 프롬프트 생성
   */
  buildContextCompressionSystemPrompt(): string {
    return `
    당신은 상담 대화의 맥락을 이해하고, 압축된 컨텍스트를 생성하는 전문가입니다.
    상담 대화의 흐름과 중요 정보를 파악하여, 추후 상담에 필요할 것으로 판단되는 압축된 컨텍스트를 생성하세요.
    `;
  }
}
