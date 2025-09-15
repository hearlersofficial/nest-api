import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CompressedMessagesRepository } from "~counselings/domains/counsels/infrastructures/compressed-messages.repository";
import { CounselCompressConditionsRepository } from "~counselings/domains/counsels/infrastructures/counsel-compress-conditions.repository";
import { CounselContextsRepository } from "~counselings/domains/counsels/infrastructures/counsel-contexts.repository";
import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import {
  CompressedMessages,
  CompressedMessagesNewProps,
} from "~counselings/domains/counsels/models/compressed-messages";
import {
  CounselCompressConditions,
  CounselCompressConditionsNewProps,
} from "~counselings/domains/counsels/models/counsel-compress-conditions";
import { CounselContexts, CounselContextsNewProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { CounselMessages, CounselMessagesNewProps } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels, CounselsNewProps } from "~counselings/domains/counsels/models/counsels";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryCounselsStore extends CounselsStore {
  constructor(
    private readonly counselRepository: CounselsRepository,
    private readonly counselMessagesRepository: CounselMessagesRepository,
    private readonly compressedMessagesRepository: CompressedMessagesRepository,
    private readonly counselCompressConditionsRepository: CounselCompressConditionsRepository,
    private readonly counselContextsRepository: CounselContextsRepository,
  ) {
    super();
  }

  override async create(newProps: CounselsNewProps): Promise<Counsels> {
    const counselResult = Counsels.createNew(newProps);
    if (counselResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselResult.error as string);
    }
    return this.counselRepository.save(counselResult.value);
  }

  override async update(counsel: Counsels): Promise<Counsels> {
    return this.counselRepository.save(counsel);
  }

  override async updateMany(counsels: Counsels[]): Promise<Counsels[]> {
    return this.counselRepository.save(counsels);
  }

  override async createMessage(newProps: CounselMessagesNewProps): Promise<CounselMessages> {
    const counselMessageResult = CounselMessages.createNew(newProps);
    if (counselMessageResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselMessageResult.error as string);
    }
    return this.counselMessagesRepository.save(counselMessageResult.value);
  }

  override async updateMessage(counselMessage: CounselMessages): Promise<CounselMessages> {
    return this.counselMessagesRepository.save(counselMessage);
  }

  override async updateManyMessages(counselMessages: CounselMessages[]): Promise<CounselMessages[]> {
    return this.counselMessagesRepository.save(counselMessages);
  }

  override async createCompressedMessage(newProps: CompressedMessagesNewProps): Promise<CompressedMessages> {
    const compressedMessageResult = CompressedMessages.createNew(newProps);
    if (compressedMessageResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, compressedMessageResult.error as string);
    }
    return this.compressedMessagesRepository.save(compressedMessageResult.value);
  }

  override async updateCompressedMessage(compressedMessage: CompressedMessages): Promise<CompressedMessages> {
    return this.compressedMessagesRepository.save(compressedMessage);
  }

  override async updateManyCompressedMessages(compressedMessages: CompressedMessages[]): Promise<CompressedMessages[]> {
    return this.compressedMessagesRepository.save(compressedMessages);
  }

  override async createCompressConditions(
    newProps: CounselCompressConditionsNewProps,
  ): Promise<CounselCompressConditions> {
    const compressConditionsResult = CounselCompressConditions.createNew(newProps);
    if (compressConditionsResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, compressConditionsResult.error as string);
    }
    return this.counselCompressConditionsRepository.save(compressConditionsResult.value);
  }

  override async updateCompressConditions(
    compressConditions: CounselCompressConditions,
  ): Promise<CounselCompressConditions> {
    return this.counselCompressConditionsRepository.save(compressConditions);
  }

  override async createContexts(newProps: CounselContextsNewProps): Promise<CounselContexts> {
    const contextsResult = CounselContexts.createNew(newProps);
    if (contextsResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, contextsResult.error as string);
    }
    return this.counselContextsRepository.save(contextsResult.value);
  }

  override async updateContexts(contexts: CounselContexts): Promise<CounselContexts> {
    return this.counselContextsRepository.save(contexts);
  }
}
