import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import {
  COUNSEL_MESSAGE_REPOSITORY,
  CounselMessagesRepositoryPort,
} from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselMessageReader {
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessageRepository: CounselMessagesRepositoryPort,
  ) {}

  async findOne(counselMessageId: UniqueEntityId): Promise<CounselMessages> {
    const counselMessage = await this.counselMessageRepository.findOne(counselMessageId);
    return counselMessage;
  }

  async findAll(): Promise<CounselMessages[]> {
    const counselMessages = await this.counselMessageRepository.findAll();
    return counselMessages;
  }

  async findMany(props: { counselId?: UniqueEntityId }): Promise<CounselMessages[]> {
    const counselMessages = await this.counselMessageRepository.findMany(props);
    return counselMessages;
  }
}
