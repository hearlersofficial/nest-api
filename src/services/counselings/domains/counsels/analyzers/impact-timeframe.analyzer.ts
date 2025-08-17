import { BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.enum";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContexts, CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
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
    const impactDomain = CounselContexts.getEnumOverview(ImpactDomain);
    const timeframe = CounselContexts.getEnumOverview(Timeframe);
    const perceivedControl = CounselContexts.getEnumOverview(PerceivedControl);
    return `
You are assessing problem scope and temporal context using ecological systems theory (Bronfenbrenner) and crisis intervention principles.

${impactDomain}

${timeframe}

${perceivedControl}

Rules:
- Output JSON keys among: impactDomain, timeframe, perceivedControl.
- Add impactDomainExplanation, timeframeExplanation, perceivedControlExplanation when given.
- If unclear, omit keys.`;
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
      const intKeys = ["impactDomain", "timeframe", "perceivedControl"] as const;
      for (const k of intKeys) {
        if (json[k] === null || typeof json[k] === "number") (out as any)[k] = json[k];
      }
      return out;
    } catch {
      return {};
    }
  }
}
