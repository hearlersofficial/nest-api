import { AnalyzerValidator } from "~counselings/domains/counsels/analyzers/analyzer.validator";
import { BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import {
  CONTEXT_DOMAIN_REGISTRY,
  ContextDomain,
  FIELD_DESCRIPTIONS,
} from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { ImpactDomain, PerceivedControl, Timeframe } from "~proto/com/hearlers/v1/model/counsel_pb";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

@Injectable()
export class ImpactTimeframeAnalyzer extends BaseDomainAnalyzer {
  public readonly domain = ContextDomain.IMPACT_TIMEFRAME;

  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly historyBuilder: ConversationHistoryBuilder,
    @Inject(ASSISTANT_AGENT) private readonly assistantAgent: AssistantAgent,
  ) {
    super();
  }

  async analyze(counsel: Counsels): Promise<Partial<CounselContextsProps>> {
    const messages = await this.counselsReader.findManyMessages({
      counselId: counsel.id,
      limit: 20,
      orderBy: { id: "DESC" },
    });
    if (!messages.length) return {};

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

    return this.pick(response.content);
  }

  private getSystemPrompt(): string {
    const config = CONTEXT_DOMAIN_REGISTRY[ContextDomain.IMPACT_TIMEFRAME];
    const impactDomainOptions = AnalyzerValidator.formatFieldOptions("impactDomain");
    const timeframeOptions = AnalyzerValidator.formatFieldOptions("timeframe");
    const perceivedControlOptions = AnalyzerValidator.formatFieldOptions("perceivedControl");

    return `You are an expert assessor of problem scope and temporal context using ecological systems theory (Bronfenbrenner) and crisis intervention principles.

DOMAIN ANALYSIS:
${config.description}

RELATED FIELDS: ${config.relatedFields.join(", ")}

ANALYSIS GUIDELINES:
${config.analysisGuidelines}

IMPACT DOMAIN OPTIONS:
${impactDomainOptions}

TIMEFRAME OPTIONS:
${timeframeOptions}

PERCEIVED CONTROL OPTIONS:
${perceivedControlOptions}

OUTPUT FORMAT: Return only valid JSON with available fields:
{
  "impactDomain": <ImpactDomain_enum_value>,
  "timeframe": <Timeframe_enum_value>,
  "perceivedControl": <PerceivedControl_enum_value>
}

Rules:
- Use exact enum values: ImpactDomain (${Object.keys(FIELD_DESCRIPTIONS.impactDomain.values).join(", ")}), Timeframe (${Object.keys(FIELD_DESCRIPTIONS.timeframe.values).join(", ")}), PerceivedControl (${Object.keys(FIELD_DESCRIPTIONS.perceivedControl.values).join(", ")})
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

      AnalyzerValidator.validateEnumField(json, result, { key: "impactDomain", enumType: ImpactDomain });
      AnalyzerValidator.validateEnumField(json, result, { key: "timeframe", enumType: Timeframe });
      AnalyzerValidator.validateEnumField(json, result, { key: "perceivedControl", enumType: PerceivedControl });

      return result;
    } catch {
      return {};
    }
  }
}
