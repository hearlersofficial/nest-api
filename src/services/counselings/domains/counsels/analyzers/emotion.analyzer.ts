import { AnalyzerValidator } from "~counselings/domains/counsels/analyzers/analyzer.validator";
import { AnalysisResult, BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import {
  CONTEXT_DOMAIN_REGISTRY,
  ContextDomain,
  FIELD_DESCRIPTIONS,
} from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContexts, CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { ArousalLevel, EmotionPrimary, Valence } from "~proto/com/hearlers/v1/model/counsel_pb";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

@Injectable()
export class EmotionAnalyzer extends BaseDomainAnalyzer {
  public readonly domain = ContextDomain.EMOTION;

  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly historyBuilder: ConversationHistoryBuilder,
    @Inject(ASSISTANT_AGENT) private readonly assistantAgent: AssistantAgent,
  ) {
    super();
  }

  async analyze(counselContext: CounselContexts): Promise<AnalysisResult> {
    const startTime = Date.now();
    const messages = await this.counselsReader.findManyMessages({
      counselId: counselContext.counselId,
      limit: 20,
      orderBy: { id: "DESC" },
    });

    if (!messages.length) {
      return this.createFailureResult("No messages found", 0, Date.now() - startTime);
    }

    try {
      const conversationJson = this.historyBuilder.buildHistoryFromDomain(messages);
      const response = await this.assistantAgent.call({
        conversationId: counselContext.counselId.toString(),
        message: this.getUserPrompt(conversationJson),
        systemPrompt: this.getSystemPrompt(),
        aiModel: AiModel.GPT_5,
        temperature: 0,
        maxToolCalls: 0,
        useTools: false,
      });

      const updates = this.pick(response.content);
      const processingTime = Date.now() - startTime;
      const quality = this.assessQuality(updates, response.content);

      return this.createResult(updates, messages.length, processingTime, quality);
    } catch (error) {
      return this.createFailureResult(
        error instanceof Error ? error.message : "Unknown error",
        messages.length,
        Date.now() - startTime,
      );
    }
  }

  private getSystemPrompt(): string {
    const config = CONTEXT_DOMAIN_REGISTRY[ContextDomain.EMOTION];

    return `You are an expert emotions specialist using counseling psychology techniques (affect labeling, appraisal theory cues).
Select codes with care; ground choices in the conversation content.

DOMAIN ANALYSIS:
${config.description}

RELATED FIELDS: ${config.relatedFields.join(", ")}

ANALYSIS GUIDELINES:
${config.analysisGuidelines}

EMOTION PRIMARY OPTIONS:
${AnalyzerValidator.formatFieldOptions("emotionPrimary")}

VALENCE OPTIONS:
${AnalyzerValidator.formatFieldOptions("valence")}

AROUSAL LEVEL OPTIONS:
${AnalyzerValidator.formatFieldOptions("arousal")}

EMOTION INTENSITY:
${FIELD_DESCRIPTIONS.emotionIntensity.description}
${AnalyzerValidator.formatFieldOptions("emotionIntensity")}

OUTPUT FORMAT: Return only valid JSON with available fields:
{
  "emotionPrimary": <EmotionPrimary_enum_value>,
  "valence": <Valence_enum_value>,
  "arousal": <ArousalLevel_enum_value>,
  "emotionIntensity": <number_0_to_10>
}

Rules:
- Use exact enum values: EmotionPrimary (${Object.keys(FIELD_DESCRIPTIONS.emotionPrimary.values).join(", ")}), Valence (${Object.keys(FIELD_DESCRIPTIONS.valence.values).join(", ")}), ArousalLevel (${Object.keys(FIELD_DESCRIPTIONS.arousal.values).join(", ")})
- Only include fields you can confidently assess from the conversation
- If evidence is insufficient, omit that field entirely`;
  }

  private getUserPrompt(conversationJson: string): string {
    return `
<CONVERSATION>
${conversationJson}
</CONVERSATION>

Return ONLY JSON.`;
  }

  private pick(content: string): Partial<CounselContextsProps> {
    try {
      const json = AnalyzerValidator.extractJsonFromContent(content);
      const result: Partial<CounselContextsProps> = {};

      // Validate enum fields
      AnalyzerValidator.validateEnumField(json, result, { key: "emotionPrimary", enumType: EmotionPrimary });
      AnalyzerValidator.validateEnumField(json, result, { key: "valence", enumType: Valence });
      AnalyzerValidator.validateEnumField(json, result, { key: "arousal", enumType: ArousalLevel });

      // Validate integer field
      AnalyzerValidator.validateIntegerField(json, result, { key: "emotionIntensity", min: 0, max: 10 });

      return result;
    } catch {
      return {};
    }
  }
}
