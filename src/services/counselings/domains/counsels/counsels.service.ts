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
import { CounselCompressConditionsInfo } from "~counselings/domains/counsels/models/counsel-compress-conditions.info";
import { CounselContextsInfo } from "~counselings/domains/counsels/models/counsel-contexts.info";
import { CounselMessagesInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselsInfo } from "~counselings/domains/counsels/models/counsels.info";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
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
  async initializeCounsel(props: {
    userId: UserId;
    counselorId: CounselorId;
    promptVersionId: PromptVersionId;
    counselorUserRelationshipId: CounselorUserRelationshipId;
    counselTechniqueId: CounselTechniqueId;
  }): Promise<CounselsInfo> {
    const { userId, counselorId, promptVersionId, counselorUserRelationshipId, counselTechniqueId } = props;
    const counsel = await this.counselsStore.create({
      userId,
      counselorId,
      promptVersionId,
      counselorUserRelationshipId,
    });
    await this.counselsStore.createContexts({
      counselId: counsel.id,
      counselTechniqueId,
    });
    await this.counselsStore.createCompressConditions({
      counselId: counsel.id,
    });
    return CounselsInfo.fromDomain(counsel);
  }

  async getOne(props: { counselId: CounselId }): Promise<CounselsInfo> {
    const counsel = await this.counselsReader.findOne(props);
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    return CounselsInfo.fromDomain(counsel);
  }

  async getContext(props: { counselId: CounselId }): Promise<CounselContextsInfo> {
    const context = await this.counselsReader.findContexts(props);
    if (!context) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel context not found");
    }
    return CounselContextsInfo.fromDomain(context);
  }

  async getCompressCondition(props: { counselId: CounselId }): Promise<CounselCompressConditionsInfo> {
    const condition = await this.counselsReader.findCompressConditions(props);
    if (!condition) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel compress condition not found");
    }
    return CounselCompressConditionsInfo.fromDomain(condition);
  }

  async getMessages(criteria: CounselMessagesCriteriaFindMany): Promise<CounselMessagesInfo[]> {
    const messages = await this.counselsReader.findManyMessages(criteria);
    return CounselMessagesInfo.fromDomainArray(messages);
  }

  async getSessionInfo(props: { counselId: CounselId }): Promise<{
    counsel: CounselsInfo;
    messages: CounselMessagesInfo[];
    compressedMessages: CompressedMessagesInfo[];
    counselContext: CounselContextsInfo;
    compressCondition: CounselCompressConditionsInfo;
  }> {
    const counsel = await this.counselsReader.findOne(props);
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    const counselContext = await this.counselsReader.findContexts(props);
    if (!counselContext) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel context not found");
    }
    const compressCondition = await this.counselsReader.findCompressConditions(props);
    if (!compressCondition) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel compress condition not found");
    }
    const messages = await this.counselsReader.findManyMessages({
      counselId: props.counselId,
      limit: counsel.messageCount - compressCondition.messageCountAtLastCompression,
    });
    const compressedMessages = await this.counselsReader.findManyCompressedMessages({ counselId: props.counselId });

    return {
      counsel: CounselsInfo.fromDomain(counsel),
      messages: CounselMessagesInfo.fromDomainArray(messages),
      compressedMessages: CompressedMessagesInfo.fromDomainArray(compressedMessages),
      counselContext: CounselContextsInfo.fromDomain(counselContext),
      compressCondition: CounselCompressConditionsInfo.fromDomain(compressCondition),
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
    currentMessageCount: number;
  }): Promise<void> {
    const { counselId, counselTechniqueId, currentMessageCount } = props;
    const counselContext = await this.counselsReader.findContexts({ counselId });
    if (!counselContext) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel context not found");
    }

    counselContext.updateCounselTechniqueId(counselTechniqueId, currentMessageCount);

    await this.counselsStore.updateContexts(counselContext);
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
    const counselContext = await this.counselsReader.findContexts({ counselId });
    if (!counselContext) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel context not found");
    }
    const newMessage = await this.counselsStore.createMessage({
      counselId,
      message,
      isUserMessage,
      userId: counsel.userId,
      counselTechniqueId: counselContext.counselTechniqueId,
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
    const counselContext = await this.counselsReader.findContexts({ counselId });
    if (!counselContext) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel context not found");
    }
    await this.contextOrganizer.organizeContext(counselContext);
  }

  // 조회 및 위임
  async compressContext(props: { counselId: CounselId }): Promise<void> {
    const { counselId } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    const counselCompressConditions = await this.counselsReader.findCompressConditions({ counselId });
    if (!counselCompressConditions) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel compress condition not found");
    }
    const currentMessageCount = counsel.messageCount;
    if (counselCompressConditions.shouldCompressContext(currentMessageCount)) {
      await this.messageCompressor.compressContext(counselCompressConditions, currentMessageCount);
    }
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
