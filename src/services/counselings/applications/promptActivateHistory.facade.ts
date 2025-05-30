import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { PromptActivateHistoryService } from "~counselings/domains/promptActivateHistory/promptActivateHistory.service";

import { Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";

@Injectable()
export class PromptActivateHistoryFacade {
  constructor(private readonly promptActivateHistoryService: PromptActivateHistoryService) {}

  async findPromptActivateHistoryById(params: {
    promptActivateHistoryId: UniqueEntityId;
  }): Promise<PromptActivateHistories> {
    const { promptActivateHistoryId } = params;
    return this.promptActivateHistoryService.getOne({ promptActivateHistoryId });
  }

  async findPromptActivateHistories(params: {
    promptVersionId?: UniqueEntityId;
    activatedAtBefore?: Dayjs;
  }): Promise<PromptActivateHistories[]> {
    const { promptVersionId, activatedAtBefore } = params;
    return this.promptActivateHistoryService.findMany({ promptVersionId, activatedAtBefore });
  }
}
