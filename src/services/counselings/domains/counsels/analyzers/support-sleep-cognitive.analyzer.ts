import { BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.enum";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { CognitiveLoad, SleepQuality, SocialSupportLevel } from "~proto/com/hearlers/v1/model/counsel_pb";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

@Injectable()
export class SupportSleepCognitiveAnalyzer extends BaseDomainAnalyzer {
  public readonly domain = ContextDomain.SUPPORT_SLEEP_COGNITIVE;

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
    const support = CounselContexts.getEnumOverview(SocialSupportLevel);
    const sleep = CounselContexts.getEnumOverview(SleepQuality);
    const load = CounselContexts.getEnumOverview(CognitiveLoad);

    return `
You are assessing environmental and physiological context (social support, sleep hygiene, cognitive load), using CBT/behavioral activation cues.

${support}

${sleep}

${load}

<PHYSICAL_SYMPTOMS>
// true: physical symptoms mentioned, false: no physical symptoms, null: unclear
</PHYSICAL_SYMPTOMS>

Rules:
- Output JSON keys among: socialSupport, sleepQuality, cognitiveLoad, physicalSymptomsPresent.
- Add socialSupportExplanation, sleepQualityExplanation, cognitiveLoadExplanation when available.
- If insufficient data, omit keys.`;
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
      const intKeys = ["socialSupport", "sleepQuality", "cognitiveLoad"] as const;
      for (const k of intKeys) {
        if (json[k] === null || typeof json[k] === "number") (out as any)[k] = json[k];
      }
      if (json.physicalSymptomsPresent === null || typeof json.physicalSymptomsPresent === "boolean") {
        (out as any).physicalSymptomsPresent = json.physicalSymptomsPresent;
      }
      return out;
    } catch {
      return {};
    }
  }
}
