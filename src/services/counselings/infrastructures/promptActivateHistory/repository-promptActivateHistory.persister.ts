import { PromptActivateHistories, PromptActivateHistoriesNewProps } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { PromptActivateHistoryPersister } from "~counselings/domains/promptActivateHistory/promptActivateHistory.persister";
import { PromptActivateHistoryRepository } from "~counselings/infrastructures/promptActivateHistory/promptActivateHistory.repository";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryPromptActivateHistoryPersister extends PromptActivateHistoryPersister {
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
