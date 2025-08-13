import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { CounselsNewProps } from "~counselings/domains/counsels/models/counsels";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselsService {
  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly counselsStore: CounselsStore,
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

  async getOneWithMessages(props: { counselId: CounselId }): Promise<{
    counsel: CounselInfo;
    messages: CounselMessageInfo[];
  }> {
    const counsel = await this.counselsReader.findOne(props);
    const messages = await this.counselsReader.findManyMessages({ counselId: props.counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    return {
      counsel: CounselInfo.fromDomain(counsel),
      messages: CounselMessageInfo.fromDomainArray(messages),
    };
  }

  async getMany(props: CounselsCriteriaFindMany): Promise<CounselInfo[]> {
    const counsels = await this.counselsReader.findMany(props);
    return Promise.all(
      counsels.map(async (counsel) => {
        const messages = await this.counselsReader.findManyMessages({ counselId: counsel.id });
        return CounselInfo.fromDomain(counsel);
      }),
    );
  }

  @Transactional()
  async updateCounselTechniqueId(props: {
    counselId: UniqueEntityId;
    counselTechniqueId: UniqueEntityId;
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
    return {
      counsel: CounselInfo.fromDomain(updatedCounsel),
      message: CounselMessageInfo.fromDomain(newMessage.value),
    };
  }

  @Transactional()
  async markContextCompressed(props: { counselId: UniqueEntityId }): Promise<CounselInfo> {
    const { counselId } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    counsel.markContextCompressed();
    const updatedCounsel = await this.counselsStore.update(counsel);
    return CounselInfo.fromDomain(updatedCounsel);
  }

  @Transactional()
  async increaseMessageCount(props: { counselId: UniqueEntityId }): Promise<CounselInfo> {
    const { counselId } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    counsel.increaseMessageCount();
    const updatedCounsel = await this.counselsStore.update(counsel);
    return CounselInfo.fromDomain(updatedCounsel);
  }

  @Transactional()
  async reactMessage(props: {
    counselMessageId: UniqueEntityId;
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
