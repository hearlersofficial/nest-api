import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import {
  CounselMessagesCriteriaFindMany,
  CounselsCriteriaFindMany,
} from "~counselings/domains/counsels/counsels.criteria";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { MessageCompressor } from "~counselings/domains/counsels/message.compressor";
import { CompressedMessageInfo } from "~counselings/domains/counsels/models/compressed-context.info";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { CounselsNewProps } from "~counselings/domains/counsels/models/counsels";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselsService {
  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly counselsStore: CounselsStore,
    private readonly messageCompressor: MessageCompressor,
    private readonly conversationHistoryBuilder: ConversationHistoryBuilder,
  ) {}

  @Transactional()
  async create(newProps: CounselsNewProps): Promise<CounselInfo> {
    const counsel = await this.counselsStore.create(newProps);
    return CounselInfo.fromDomain(counsel);
  }

  async getOne(props: { counselId: CounselId }): Promise<CounselInfo> {
    const counsel = await this.counselsReader.findOne(props);
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    return CounselInfo.fromDomain(counsel);
  }

  async getMessages(criteria: CounselMessagesCriteriaFindMany): Promise<CounselMessageInfo[]> {
    const messages = await this.counselsReader.findManyMessages(criteria);
    return CounselMessageInfo.fromDomainArray(messages);
  }

  async getSessionInfo(props: { counselId: CounselId }): Promise<{
    counsel: CounselInfo;
    messages: CounselMessageInfo[];
    compressedMessages: CompressedMessageInfo[];
  }> {
    const counsel = await this.counselsReader.findOne(props);
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    const messages = await this.counselsReader.findManyMessages({
      counselId: props.counselId,
      limit: counsel.counselContexts.notCompressedMessageCount,
    });
    const compressedMessages = await this.counselsReader.findManyCompressedMessages({ counselId: props.counselId });

    return {
      counsel: CounselInfo.fromDomain(counsel),
      messages: CounselMessageInfo.fromDomainArray(messages),
      compressedMessages: CompressedMessageInfo.fromDomainArray(compressedMessages),
    };
  }

  buildHistory(props: {
    counselId: CounselId;
    messages: CounselMessageInfo[];
    compressedMessages: CompressedMessageInfo[];
  }): string {
    const { messages, compressedMessages } = props;
    return this.conversationHistoryBuilder.buildHistory(messages, compressedMessages);
  }

  async getMany(props: CounselsCriteriaFindMany): Promise<CounselInfo[]> {
    const counsels = await this.counselsReader.findMany(props);
    return Promise.all(
      counsels.map(async (counsel) => {
        return CounselInfo.fromDomain(counsel);
      }),
    );
  }

  @Transactional()
  async updateCounselTechniqueId(props: {
    counselId: CounselId;
    counselTechniqueId: CounselTechniqueId;
  }): Promise<CounselInfo> {
    const { counselId, counselTechniqueId } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }

    counsel.updateCounselTechniqueId(counselTechniqueId);

    const updatedCounsel = await this.counselsStore.update(counsel);
    return CounselInfo.fromDomain(updatedCounsel);
  }

  @Transactional()
  async saveMessage(props: {
    counselId: CounselId;
    message: string;
    isUserMessage: boolean;
  }): Promise<{ counsel: CounselInfo; message: CounselMessageInfo }> {
    const { counselId, message, isUserMessage } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    const newMessage = CounselMessages.createNew({
      counselId: counsel.id,
      message,
      isUserMessage,
      userId: counsel.userId,
      counselTechniqueId: counsel.counselTechniqueId,
    });

    if (newMessage.isFailureResult()) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, newMessage.error);
    }
    counsel.saveLastMessage(message);
    const updatedCounsel = await this.counselsStore.update(counsel);
    if (counsel.counselContexts.shouldCompressContext()) {
      await this.messageCompressor.compressContext(counsel);
    }
    return {
      counsel: CounselInfo.fromDomain(updatedCounsel),
      message: CounselMessageInfo.fromDomain(newMessage.value),
    };
  }

  @Transactional()
  async reactMessage(props: {
    counselMessageId: CounselMessageId;
    reaction: CounselMessageReaction;
  }): Promise<CounselMessageInfo> {
    const { counselMessageId, reaction } = props;
    const counselMessage = await this.counselsReader.findOneMessage({ counselMessageId });
    if (!counselMessage) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "CounselMessage not found");
    }

    counselMessage.react(reaction);

    const updatedCounselMessage = await this.counselsStore.updateMessage(counselMessage);
    return CounselMessageInfo.fromDomain(updatedCounselMessage);
  }
}
