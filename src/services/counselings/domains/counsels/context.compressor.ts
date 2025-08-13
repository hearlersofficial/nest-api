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
    const systemPrompt = this.getSystemPrompt(counsel);
    const userPrompt = this.getUserPrompt(counsel);

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

  private getSystemPrompt(counsel: Counsels): string {
    return `
    당신은 상담 대화의 맥락을 이해하고, 압축된 컨텍스트를 생성하는 전문가입니다.
    상담 대화의 흐름과 중요 정보를 파악하여, 추후 상담에 필요할 것으로 판단되는 압축된 컨텍스트를 생성하세요.
    `;
  }

  private getUserPrompt(counsel: Counsels): string {
    return `
    상담 대화의 흐름과 중요 정보를 파악하여, 추후 상담에 필요할 것으로 판단되는 압축된 컨텍스트를 생성하세요.
    `;
  }
}
