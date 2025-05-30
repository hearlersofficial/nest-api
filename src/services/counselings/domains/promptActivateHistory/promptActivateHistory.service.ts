import {
  PromptActivateHistories,
  PromptActivateHistoriesNewProps,
} from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/promptActivateHistory/promptActivateHistory.criteria";
import { PromptActivateHistoryPersister } from "~counselings/domains/promptActivateHistory/promptActivateHistory.persister";
import { PromptActivateHistoryReader } from "~counselings/domains/promptActivateHistory/promptActivateHistory.reader";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class PromptActivateHistoryService {
  constructor(
    private readonly promptActivateHistoryReader: PromptActivateHistoryReader,
    private readonly promptActivateHistoryPersister: PromptActivateHistoryPersister,
  ) {}

  async create(promptActivateHistory: PromptActivateHistoriesNewProps): Promise<PromptActivateHistories> {
    return this.promptActivateHistoryPersister.create(promptActivateHistory);
  }

  async update(promptActivateHistory: PromptActivateHistories): Promise<PromptActivateHistories> {
    return this.promptActivateHistoryPersister.update(promptActivateHistory);
  }

  async findOne(props: { promptActivateHistoryId: UniqueEntityId }): Promise<PromptActivateHistories | null> {
    return this.promptActivateHistoryReader.findOne(props);
  }

  async getOne(props: { promptActivateHistoryId: UniqueEntityId }): Promise<PromptActivateHistories> {
    const promptActivateHistory = await this.findOne(props);
    if (!promptActivateHistory) {
      throw new Error("PromptActivateHistory not found");
    }
    return promptActivateHistory;
  }

  async findMany(props: PromptActivateHistoryCriteriaFindMany): Promise<PromptActivateHistories[]> {
    return this.promptActivateHistoryReader.findMany(props);
  }
}
