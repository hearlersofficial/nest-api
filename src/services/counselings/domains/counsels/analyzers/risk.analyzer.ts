import { BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.enum";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";
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

  async analyze(counsel: Counsels): Promise<Partial<CounselContextsProps>> {
    const messages = await this.counselsReader.findManyMessages({
      counselId: counsel.id,
      limit: 30,
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
    const riskKind = CounselContexts.getEnumOverview(RiskKind);
    return `
You are a clinical risk assessment specialist (use Columbia-Suicide Severity Rating Scale cues where relevant).
Assess riskKind and riskSeverity based on explicit and implicit indicators.

${riskKind}

<RISK_SEVERITY>
{
  0: { name: "NONE", meaning: "No immediate severity" },
  1: { name: "LOW", meaning: "Mild concerns, monitor" },
  2: { name: "MODERATE", meaning: "Clear risk, safety planning indicated" },
  3: { name: "HIGH", meaning: "Imminent risk, urgent intervention" }
}
</RISK_SEVERITY>

Rules:
- Output JSON keys among: riskKind, riskSeverity.
- Add riskKindExplanation and riskSeverityExplanation when provided.
- If insufficient evidence, omit keys.`;
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
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      const json = JSON.parse(content.slice(start, end + 1));
      const out: Partial<CounselContextsProps> = {};
      const intKeys = ["riskKind", "riskSeverity"] as const;
      for (const k of intKeys) {
        if (json[k] === null || typeof json[k] === "number") (out as any)[k] = json[k];
      }
      return out;
    } catch {
      return {};
    }
  }
}
