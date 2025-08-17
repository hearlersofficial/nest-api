import { BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.enum";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
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
    const allianceStrength = CounselContexts.getEnumOverview(AllianceStrength);
    return `
You are assessing therapeutic alliance (Bordin alliance factors: goals, tasks, bond) and readiness for depth.

${allianceStrength}

<CONSENT_TO_DEPTH>
// true: open to deeper exploration, false: prefers surface level, null: unclear
</CONSENT_TO_DEPTH>

Rules:
- Output JSON keys among: allianceStrength, consentToDepth.
- Add allianceStrengthExplanation when given.
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
      if (json.allianceStrength === null || typeof json.allianceStrength === "number") {
        (out as any).allianceStrength = json.allianceStrength;
      }
      if (json.consentToDepth === null || typeof json.consentToDepth === "boolean") {
        (out as any).consentToDepth = json.consentToDepth;
      }
      return out;
    } catch {
      return {};
    }
  }
}
