import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import {
  COUNSEL_MESSAGE_REPOSITORY,
  CounselMessagesRepositoryPort,
} from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselMessagePersister {
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessageRepository: CounselMessagesRepositoryPort,
  ) {}

  async create(counselMessage: CounselMessages): Promise<CounselMessages> {
    const createdCounselMessage = await this.counselMessageRepository.create(counselMessage);
    return createdCounselMessage;
  }

  async update(counselMessage: CounselMessages): Promise<CounselMessages> {
    const updatedCounselMessage = await this.counselMessageRepository.update(counselMessage);
    return updatedCounselMessage;
  }
}
