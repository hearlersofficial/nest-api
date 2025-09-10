import { AnalyzerValidator } from "~counselings/domains/counsels/analyzers/analyzer.validator";
import { AnalysisResult, BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import {
  CONTEXT_DOMAIN_REGISTRY,
  ContextDomain,
  FIELD_DESCRIPTIONS,
} from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { MotivationStage } from "~proto/com/hearlers/v1/model/counsel_pb";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

@Injectable()
export class MotivationAnalyzer extends BaseDomainAnalyzer {
  public readonly domain = ContextDomain.MOTIVATION;

  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly historyBuilder: ConversationHistoryBuilder,
    @Inject(ASSISTANT_AGENT) private readonly assistantAgent: AssistantAgent,
  ) {
    super();
  }

  async analyze(counsel: Counsels): Promise<AnalysisResult> {
    const startTime = Date.now();
    const messages = await this.counselsReader.findManyMessages({
      counselId: counsel.id,
      limit: 20,
      orderBy: { id: "DESC" },
    });

    if (!messages.length) {
      return this.createFailureResult("No messages found", 0, Date.now() - startTime);
    }

    try {
      const conversationJson = this.historyBuilder.buildHistoryFromDomain(messages);
      const response = await this.assistantAgent.call({
        conversationId: counsel.id.toString(),
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
    const config = CONTEXT_DOMAIN_REGISTRY[ContextDomain.MOTIVATION];
    const motivationStageOptions = AnalyzerValidator.formatFieldOptions("motivationStage");

    return `You are an expert motivational interviewing specialist (OARS, change talk vs sustain talk, self-efficacy scaling).
Infer motivation stage and estimate self-efficacy.

DOMAIN ANALYSIS:
${config.description}

RELATED FIELDS: ${config.relatedFields.join(", ")}

ANALYSIS GUIDELINES:
${config.analysisGuidelines}

MOTIVATION STAGE OPTIONS:
${motivationStageOptions}

SELF EFFICACY:
Scale: 0-10 where higher indicates stronger confidence to execute change
- 0-2: Very low confidence in ability to change
- 3-4: Low confidence, significant doubts
- 5-6: Moderate confidence, some uncertainty
- 7-8: High confidence in ability to change
- 9-10: Very high confidence, strong self-efficacy

OUTPUT FORMAT: Return only valid JSON with available fields:
{
  "motivationStage": <MotivationStage_enum_value>,
  "selfEfficacy": <number_0_to_10>
}

Rules:
- Use exact enum values: MotivationStage (${Object.keys(FIELD_DESCRIPTIONS.motivationStage.values).join(", ")})
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

      AnalyzerValidator.validateEnumField(json, result, { key: "motivationStage", enumType: MotivationStage });
      AnalyzerValidator.validateIntegerField(json, result, { key: "selfEfficacy", min: 0, max: 10 });

      return result;
    } catch {
      return {};
    }
  }
}
