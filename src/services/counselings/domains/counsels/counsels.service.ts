import { ContextOrganizer } from "~counselings/domains/counsels/context.organizer";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import {
  CounselMessagesCriteriaFindMany,
  CounselsCriteriaFindMany,
} from "~counselings/domains/counsels/counsels.criteria";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { MessageCompressor } from "~counselings/domains/counsels/message.compressor";
import { CompressedMessagesInfo } from "~counselings/domains/counsels/models/compressed-messages.info";
import { CounselMessagesInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselsNewProps } from "~counselings/domains/counsels/models/counsels";
import { CounselsInfo } from "~counselings/domains/counsels/models/counsels.info";
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
    private readonly contextOrganizer: ContextOrganizer,
  ) {}

  @Transactional()
  async create(newProps: CounselsNewProps): Promise<CounselsInfo> {
    const counsel = await this.counselsStore.create(newProps);
    return CounselsInfo.fromDomain(counsel);
  }

  async getOne(props: { counselId: CounselId }): Promise<CounselsInfo> {
    const counsel = await this.counselsReader.findOne(props);
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    return CounselsInfo.fromDomain(counsel);
  }

  async getMessages(criteria: CounselMessagesCriteriaFindMany): Promise<CounselMessagesInfo[]> {
    const messages = await this.counselsReader.findManyMessages(criteria);
    return CounselMessagesInfo.fromDomainArray(messages);
  }

  async getSessionInfo(props: { counselId: CounselId }): Promise<{
    counsel: CounselsInfo;
    messages: CounselMessagesInfo[];
    compressedMessages: CompressedMessagesInfo[];
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
      counsel: CounselsInfo.fromDomain(counsel),
      messages: CounselMessagesInfo.fromDomainArray(messages),
      compressedMessages: CompressedMessagesInfo.fromDomainArray(compressedMessages),
    };
  }

  buildHistory(props: {
    counselId: CounselId;
    messages: CounselMessagesInfo[];
    compressedMessages: CompressedMessagesInfo[];
  }): string {
    const { messages, compressedMessages } = props;
    return this.conversationHistoryBuilder.buildHistory(messages, compressedMessages);
  }

  async getMany(props: CounselsCriteriaFindMany): Promise<CounselsInfo[]> {
    const counsels = await this.counselsReader.findMany(props);
    return Promise.all(
      counsels.map(async (counsel) => {
        return CounselsInfo.fromDomain(counsel);
      }),
    );
  }

  @Transactional()
  async updateCounselTechniqueId(props: {
    counselId: CounselId;
    counselTechniqueId: CounselTechniqueId;
  }): Promise<CounselsInfo> {
    const { counselId, counselTechniqueId } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }

    counsel.updateCounselTechniqueId(counselTechniqueId);

    const updatedCounsel = await this.counselsStore.update(counsel);
    return CounselsInfo.fromDomain(updatedCounsel);
  }

  @Transactional()
  async saveMessage(props: {
    counselId: CounselId;
    message: string;
    isUserMessage: boolean;
  }): Promise<{ counsel: CounselsInfo; message: CounselMessagesInfo }> {
    const { counselId, message, isUserMessage } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    const newMessage = await this.counselsStore.createMessage({
      counselId,
      message,
      isUserMessage,
      userId: counsel.userId,
      counselTechniqueId: counsel.counselTechniqueId,
    });

    counsel.saveLastMessage(message);
    counsel.increaseMessageCount();
    await this.counselsStore.update(counsel);

    return {
      counsel: CounselsInfo.fromDomain(counsel),
      message: CounselMessagesInfo.fromDomain(newMessage),
    };
  }

  // 조회 및 위임
  async organizeContext(props: { counselId: CounselId }): Promise<void> {
    const { counselId } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    await this.contextOrganizer.organizeContext(counsel);
  }

  // 조회 및 위임
  async compressContext(props: { counselId: CounselId }): Promise<void> {
    const { counselId } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    await this.messageCompressor.compressContext(counsel);
  }

  @Transactional()
  async reactMessage(props: {
    counselMessageId: CounselMessageId;
    reaction: CounselMessageReaction;
  }): Promise<CounselMessagesInfo> {
    const { counselMessageId, reaction } = props;
    const counselMessage = await this.counselsReader.findOneMessage({ counselMessageId });
    if (!counselMessage) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "CounselMessage not found");
    }

    counselMessage.react(reaction);

    const updatedCounselMessage = await this.counselsStore.updateMessage(counselMessage);
    return CounselMessagesInfo.fromDomain(updatedCounselMessage);
  }
}
