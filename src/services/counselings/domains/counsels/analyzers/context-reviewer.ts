import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.enum";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

export interface ReviewInput {
  current: CounselContexts;
  previousSnapshots?: Array<Partial<CounselContexts>>;
}

export interface ReviewResult {
  shouldAnalyzeDomains: ContextDomain[];
}

@Injectable()
export class ContextReviewer {
  constructor(@Inject(ASSISTANT_AGENT) private readonly assistantAgent: AssistantAgent) {}

  public async review(input: ReviewInput & { conversation: string }): Promise<ReviewResult> {
    const { current, previousSnapshots = [], conversation } = input;

    const payload = {
      current,
      previousSnapshots,
    };

    const message = this.getUserPrompt(conversation, payload);
    const response = await this.assistantAgent.call({
      conversationId: current.counselId.getString(),
      message,
      systemPrompt: this.getSystemPrompt(),
      aiModel: AiModel.GPT_5,
      temperature: 0,
      maxToolCalls: 0,
      useTools: false,
    });

    return this.pick(response.content);
  }

  private getSystemPrompt(): string {
    return `
You are a counseling context reviewer. Decide which domains (EMOTION, RISK, MOTIVATION, SUPPORT_SLEEP_COGNITIVE, ALLIANCE, IMPACT_TIMEFRAME) warrant re-analysis given the conversation and the drift from previous snapshots.

Rules:
- Select domains when conversation suggests change, escalation, or new evidence.
- Prefer precision over recall; avoid selecting domains without evidence.
Output JSON: { shouldAnalyzeDomains: string[] }`;
  }

  private getUserPrompt(conversation: string, payload: { current: unknown; previousSnapshots: unknown[] }): string {
    return `
<CONVERSATION>
${conversation}
</CONVERSATION>

<CURRENT_CONTEXT_JSON>
${JSON.stringify(payload.current)}
</CURRENT_CONTEXT_JSON>

<PREVIOUS_CONTEXT_SNAPSHOTS_JSON>
${JSON.stringify(payload.previousSnapshots)}
</PREVIOUS_CONTEXT_SNAPSHOTS_JSON>

Return only JSON.`;
  }

  private pick(content: string): ReviewResult {
    try {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      const json = JSON.parse(content.slice(start, end + 1));
      const arr = Array.isArray(json.shouldAnalyzeDomains) ? (json.shouldAnalyzeDomains as unknown[]) : [];
      const domains = arr.filter((v: unknown) => typeof v === "string") as string[];
      const set = new Set<ContextDomain>();
      for (const d of domains) {
        if ((ContextDomain as any)[d]) set.add(d as ContextDomain);
      }
      return { shouldAnalyzeDomains: Array.from(set) };
    } catch {
      return { shouldAnalyzeDomains: [] };
    }
  }
}
