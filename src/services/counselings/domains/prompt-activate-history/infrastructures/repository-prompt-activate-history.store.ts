import { PromptActivateHistoryRepository } from "~counselings/domains/prompt-activate-history/infrastructures/promptActivateHistory.repository";
import {
  PromptActivateHistories,
  PromptActivateHistoriesNewProps,
} from "~counselings/domains/prompt-activate-history/models/prompt-activate-history";
import { PromptActivateHistoryStore } from "~counselings/domains/prompt-activate-history/prompt-activate-history.store";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryPromptActivateHistoryStore extends PromptActivateHistoryStore {
  constructor(private readonly promptActivateHistoryRepository: PromptActivateHistoryRepository) {
    super();
  }

  override async create(promptActivateHistory: PromptActivateHistoriesNewProps): Promise<PromptActivateHistories> {
    const promptActivateHistoryResult = PromptActivateHistories.createNew(promptActivateHistory);
    if (promptActivateHistoryResult.isFailure) {
      throw new Error(promptActivateHistoryResult.error as string);
    }
    return this.promptActivateHistoryRepository.save(promptActivateHistoryResult.value);
  }

  override async update(promptActivateHistory: PromptActivateHistories): Promise<PromptActivateHistories> {
    return this.promptActivateHistoryRepository.save(promptActivateHistory);
  }

  override async updateMany(promptActivateHistories: PromptActivateHistories[]): Promise<PromptActivateHistories[]> {
    return this.promptActivateHistoryRepository.save(promptActivateHistories);
  }
}
