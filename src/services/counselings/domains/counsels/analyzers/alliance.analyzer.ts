import { AnalyzerValidator } from "~counselings/domains/counsels/analyzers/analyzer.validator";
import { AnalysisResult, BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import {
  CONTEXT_DOMAIN_REGISTRY,
  ContextDomain,
} from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContexts, CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { AllianceStrength } from "~proto/com/hearlers/v1/model/counsel_pb";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

@Injectable()
export class AllianceAnalyzer extends BaseDomainAnalyzer {
  public readonly domain = ContextDomain.ALLIANCE;

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
        conversationId: counselContext.id.toString(),
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
    const config = CONTEXT_DOMAIN_REGISTRY[ContextDomain.ALLIANCE];

    return `You are an expert therapeutic alliance assessor specializing in Bordin's alliance factors (goals, tasks, bond) and client readiness for therapeutic depth.

DOMAIN ANALYSIS:
${config.description}

RELATED FIELDS: ${config.relatedFields.join(", ")}

ANALYSIS GUIDELINES:
${config.analysisGuidelines}

ALLIANCE STRENGTH OPTIONS:
${AnalyzerValidator.formatFieldOptions("allianceStrength")}

CONSENT TO DEPTH:
${AnalyzerValidator.formatFieldOptions("consentToDepth")}

ASSESSMENT CRITERIA:
- Trust indicators: Does client share personal information? Do they seem comfortable?
- Collaboration: Is there mutual agreement on goals and therapeutic approach?
- Engagement quality: Is client actively participating or passively responding?
- Resistance patterns: Are there signs of defensiveness or avoidance?
- Rapport building: Is there warmth and connection in the interaction?

OUTPUT FORMAT: Return only valid JSON with available fields:
{
  "allianceStrength": <AllianceStrength_enum_value>,
  "consentToDepth": <boolean_or_null>
}

Rules:
- Only include fields you can confidently assess
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

      // Validate enum and boolean fields
      AnalyzerValidator.validateEnumField(json, result, { key: "allianceStrength", enumType: AllianceStrength });
      AnalyzerValidator.validateBooleanField(json, result, { key: "consentToDepth" });

      return result;
    } catch {
      return {};
    }
  }
}
