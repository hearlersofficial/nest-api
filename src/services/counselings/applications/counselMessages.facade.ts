import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";

import { Injectable } from "@nestjs/common";

@Injectable()
export class CounselMessagesFacade {
  constructor(private readonly counselMessagesService: CounselMessagesService) {}

  async findMessages(params: { counselId: UniqueEntityId }): Promise<CounselMessages[]> {
    const { counselId } = params;
    return this.counselMessagesService.findMany({ counselId });
  }
}
