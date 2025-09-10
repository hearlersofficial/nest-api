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
import { RiskKind } from "~proto/com/hearlers/v1/model/counsel_pb";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

@Injectable()
export class RiskAnalyzer extends BaseDomainAnalyzer {
  public readonly domain = ContextDomain.RISK;

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
      limit: 30,
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
    const config = CONTEXT_DOMAIN_REGISTRY[ContextDomain.RISK];

    return `You are an expert clinical risk assessment specialist (use Columbia-Suicide Severity Rating Scale cues where relevant).
Assess riskKind and riskSeverity based on explicit and implicit indicators.

DOMAIN ANALYSIS:
${config.description}

RELATED FIELDS: ${config.relatedFields.join(", ")}

ANALYSIS GUIDELINES:
${config.analysisGuidelines}

RISK KIND OPTIONS:
${AnalyzerValidator.formatFieldOptions("riskKind")}

RISK SEVERITY SCALE:
${AnalyzerValidator.formatFieldOptions("riskSeverity")}

ASSESSMENT CRITERIA:
- Explicit statements of harm intent or planning
- Implicit indicators of distress or hopelessness
- Access to means of harm
- Previous history of self-harm or violence
- Current stressors and protective factors
- Social support and safety network

OUTPUT FORMAT: Return only valid JSON with available fields:
{
  "riskKind": <RiskKind_enum_value>,
  "riskSeverity": <number_0_to_3>
}

Rules:
- Use exact enum values: RiskKind (${Object.keys(FIELD_DESCRIPTIONS.riskKind.values).join(", ")})
- Only include fields you can confidently assess from the conversation
- If evidence is insufficient, omit that field entirely
- Prioritize safety - when in doubt, lean toward higher risk assessment`;
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

      // Validate enum and integer fields
      AnalyzerValidator.validateEnumField(json, result, { key: "riskKind", enumType: RiskKind });
      AnalyzerValidator.validateIntegerField(json, result, { key: "riskSeverity", min: 0, max: 3 });

      return result;
    } catch {
      return {};
    }
  }
}
