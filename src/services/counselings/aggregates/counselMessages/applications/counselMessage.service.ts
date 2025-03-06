import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselMessagePersister } from "~counselings/aggregates/counselMessages/applications/tools/counselMessage.persister";
import { CounselMessageReader } from "~counselings/aggregates/counselMessages/applications/tools/counselMessage.reader";
import {
  CounselMessages,
  CounselMessagesNewProps,
} from "~counselings/aggregates/counselMessages/domain/CounselMessages";

import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CounselMessageService {
  constructor(
    private readonly counselMessageReader: CounselMessageReader,
    private readonly counselMessagePersister: CounselMessagePersister,
  ) {}

  async create(counselMessageNewProps: CounselMessagesNewProps): Promise<CounselMessages> {
    const counselMessageOrError = CounselMessages.createNew(counselMessageNewProps);
    if (counselMessageOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselMessageOrError.error as string);
    }
    const counselMessage = counselMessageOrError.value;
    const createdCounselMessage = await this.counselMessagePersister.create(counselMessage);
    return createdCounselMessage;
  }

  async update(counselMessage: CounselMessages): Promise<CounselMessages> {
    const updatedCounselMessage = await this.counselMessagePersister.update(counselMessage);
    return updatedCounselMessage;
  }

  async findOne(counselMessageId: UniqueEntityId): Promise<CounselMessages | null> {
    const counselMessage = await this.counselMessageReader.findOne(counselMessageId);

    return counselMessage;
  }

  async findAll(): Promise<CounselMessages[]> {
    const counselMessages = await this.counselMessageReader.findAll();
    return counselMessages;
  }

  async findMany(props: { counselId?: UniqueEntityId }): Promise<CounselMessages[]> {
    const counselMessages = await this.counselMessageReader.findMany(props);
    return counselMessages;
  }

  async getOne(counselMessageId: UniqueEntityId): Promise<CounselMessages> {
    const counselMessage: CounselMessages | null = await this.findOne(counselMessageId);
    if (!counselMessage) {
      throw new NotFoundException("CounselMessage not found");
    }
    return counselMessage;
  }

  async getAll(): Promise<CounselMessages[]> {
    const counselMessages = await this.findAll();
    if (counselMessages.length === 0) {
      throw new NotFoundException("CounselMessages not found");
    }
    return counselMessages;
  }

  async getMany(props: { counselId?: UniqueEntityId }): Promise<CounselMessages[]> {
    const counselMessages = await this.findMany(props);
    if (counselMessages.length === 0) {
      throw new NotFoundException("CounselMessages not found");
    }
    return counselMessages;
  }
}
