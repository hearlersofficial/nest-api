import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CounselCompressConditions } from "~counselings/domains/counsels/models/counsel-compress-conditions";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable, Logger } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";
import { Propagation, Transactional } from "typeorm-transactional";

@Injectable()
export class MessageCompressor {
  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly counselsStore: CounselsStore,
    private readonly historyBuilder: ConversationHistoryBuilder,
    @Inject(ASSISTANT_AGENT)
    private readonly assistantAgent: AssistantAgent,
  ) {}

  private readonly logger = new Logger(MessageCompressor.name);

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  public async compressContext(
    compressCondition: CounselCompressConditions,
    currentMessageCount: number,
  ): Promise<void> {
    try {
      this.logger.log(`[MessageCompressor] compressContext: ${compressCondition.counselId.getString()}`);
      const compressedMessageContent = await this.generateCompressedMessage(compressCondition, currentMessageCount);
      const compressedMessage = await this.counselsStore.createCompressedMessage({
        counselId: compressCondition.counselId,
        content: compressedMessageContent,
        messageCountAtCompression: currentMessageCount,
      });
      compressCondition.markContextCompressed(currentMessageCount);
      await this.counselsStore.updateCompressConditions(compressCondition);

      this.logger.log(
        `[MessageCompressor] Compressed message created: ${compressedMessage.id.getString()} for counsel: ${compressCondition.counselId.getString()}`,
      );
    } catch (error) {
      this.logger.error(
        `[MessageCompressor] compressContext failed: ${compressCondition.counselId.getString()}`,
        error,
      );
      throw error;
    }
  }

  private async generateCompressedMessage(
    compressCondition: CounselCompressConditions,
    currentMessageCount: number,
  ): Promise<string> {
    const messages = await this.counselsReader.findManyMessages({
      counselId: compressCondition.counselId,
      limit: currentMessageCount - compressCondition.messageCountAtLastCompression,
      offset: 0,
      orderBy: {
        id: "DESC",
      },
    });
    const systemPrompt = this.getSystemPrompt();
    const conversationJson = this.historyBuilder.buildHistoryFromDomain(messages);
    const userPrompt = this.getUserPrompt(conversationJson);

    const response = await this.assistantAgent.call({
      conversationId: compressCondition.counselId.toString(),
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
  <CONVERSATION>
  ${conversationJson}
  </CONVERSATION>
  
  <TASK>
  Using the conversation provided, summarize the key points as instructed in the system prompt.
  </TASK>
  `;
  }
}
