import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CompressedContexts } from "~counselings/domains/counsels/models/compressed-context";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";
import { Propagation, Transactional } from "typeorm-transactional";

@Injectable()
export class ContextCompressor {
  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly counselsStore: CounselsStore,
    private readonly historyBuilder: ConversationHistoryBuilder,
    @Inject(ASSISTANT_AGENT)
    private readonly assistantAgent: AssistantAgent,
  ) {}

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  public async compressContext(counsel: Counsels): Promise<CompressedContexts> {
    const compressedContextContent = await this.generateCompressedContext(counsel);
    const compressedContext = await this.counselsStore.createCompressedContext({
      counselId: counsel.id,
      content: compressedContextContent,
      messageCountAtCompression: counsel.messageCount,
    });
    counsel.markContextCompressed();
    await this.counselsStore.update(counsel);

    return compressedContext;
  }

  private async generateCompressedContext(counsel: Counsels): Promise<string> {
    const messages = await this.counselsReader.findManyMessages({
      counselId: counsel.id,
      limit: Counsels.COMPRESSION_THRESHOLD,
      offset: 0,
      orderBy: {
        id: "DESC",
      },
    });
    const systemPrompt = this.getSystemPrompt();
    const conversationJson = this.historyBuilder.buildHistoryFromDomain(messages);
    const userPrompt = this.getUserPrompt(conversationJson);

    const response = await this.assistantAgent.call({
      conversationId: counsel.id.toString(),
      message: userPrompt,
      systemPrompt,
      aiModel: AiModel.GPT_5,
      temperature: 0,
      maxToolCalls: 1,
      useTools: false,
    });

    return response.content;
  }

  private getSystemPrompt(): string {
    return `
You are a compassionate and skilled counseling supervisor. Your task is to generate a concise summary of the conversation to maintain continuity and support the ongoing therapeutic process. Your output should be a single block of plain text without any formatting.

<RULES>
- Base your summary strictly on the provided conversation and meta-information.
- Maintain consistent participant identities and avoid making any formal clinical diagnoses.
- Prioritize concrete and actionable details that are relevant to the client's progress.
- Focus on the client's strengths and moments of positive change, aiming for a hopeful tone.
- If certain information is not present, note it as "unspecified" or omit it.
</RULES>

<INSTRUCTIONS>
- Identify the client's primary concerns and the key emotions expressed.
- Summarize the main topics discussed, including any significant events or relationships mentioned.
- Note any specific coping strategies, personal insights, or positive developments the client shared.
- Highlight any actionable goals or next steps that were agreed upon.
- Present the summary in a brief, easy-to-read paragraph.
</INSTRUCTIONS>

`;
  }

  private getUserPrompt(conversationJson: string): string {
    return `
  <CONVERSATION_JSON>
  ${conversationJson}
  </CONVERSATION_JSON>
  
  <TASK>
  Using the conversation provided, summarize the key points as instructed in the system prompt.
  Return ONLY the final JSON object.
  </TASK>
  `;
  }
}
