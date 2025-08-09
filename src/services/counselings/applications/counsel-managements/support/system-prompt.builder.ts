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
   * 기법 전환 평가용 통합 시스템 프롬프트 생성
   * @param params 평가 시스템 프롬프트 파라미터
   * @returns 완성된 평가 시스템 프롬프트
   */
  buildTechniqueEvaluationSystemPrompt(params: TechniqueEvaluationSystemPromptParams): string {
    const { currentTechnique, nextTechnique, messageThreshold } = params;

    return `
당신은 상담 기법 전환을 평가하는 전문가입니다.
상담 대화의 흐름과 현재 기법의 효과를 분석하여 다음 기법으로 전환할 적절한 시점을 판단합니다.

<CurrentTechnique>
Name: ${currentTechnique.name}
Context: ${currentTechnique.context}
Instruction: ${currentTechnique.instruction}
MessageThreshold: ${currentTechnique.messageThreshold}
</CurrentTechnique>

<NextTechnique>
Name: ${nextTechnique.name}
Context: ${nextTechnique.context}
Instruction: ${nextTechnique.instruction}
</NextTechnique>

<EvaluationCriteria>
다음 기준들을 고려하여 각각 0-100점으로 점수를 매기고, 전환 여부를 결정해주세요:

1. conversationProgressScore: 대화가 충분히 진행되었는가?
2. userEngagementScore: 사용자가 충분히 참여하고 있는가?
3. goalAchievementScore: 현재 기법의 목표가 어느 정도 달성되었는가?
4. appropriatenessScore: 다음 기법으로 전환하는 것이 적절한가?

현재 기법의 메시지 임계값: ${messageThreshold}
</EvaluationCriteria>

<ResponseFormat>
반드시 다음 JSON 형태로 응답해주세요:
{
  "shouldTransition": boolean,
  "scores": {
    "conversationProgressScore": number,
    "userEngagementScore": number,
    "goalAchievementScore": number,
    "appropriatenessScore": number,
    "overallScore": number,
    "reasoning": "판별 근거"
  },
  "confidence": number
}

overallScore는 모든 점수의 가중평균으로, shouldTransition은 overallScore가 70점 이상일 때 true로 설정하되, 
전체적인 상황을 고려하여 유연하게 판단하세요.
</ResponseFormat>
`;
  }

  /**
   * 상담 맥락 압축용 시스템 프롬프트 생성
   * @returns 압축 시스템 프롬프트
   *
   * @todo - 프롬프트 고도화
   */
  buildContextCompressionSystemPrompt(): string {
    return `
    당신은 상담 대화의 맥락을 이해하고, 압축된 컨텍스트를 생성하는 전문가입니다.
    상담 대화의 흐름과 중요 정보를 파악하여, 추후 상담에 필요할 것으로 판단되는 압축된 컨텍스트를 생성하세요.
    `;
  }
}
