import { RepositoryPromptActivateHistoryCriteriaMapper } from "~counselings/domains/prompt-activate-history/infrastructures/mappers/repository-prompt-activate-history-criteria.mapper";
import { PromptActivateHistoryRepository } from "~counselings/domains/prompt-activate-history/infrastructures/promptActivateHistory.repository";
import { PromptActivateHistories } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/prompt-activate-history/prompt-activate-history.criteria";
import { PromptActivateHistoryReader } from "~counselings/domains/prompt-activate-history/prompt-activate-history.reader";

import { Injectable } from "@nestjs/common";
import { PromptActivateHistoryId } from "~common/shared-kernel/identifiers/prompt-activate-history.id";

@Injectable()
export class RepositoryPromptActivateHistoryReader extends PromptActivateHistoryReader {
  constructor(private readonly promptActivateHistoryRepository: PromptActivateHistoryRepository) {
    super();
  }

  override async findOne(props: {
    promptActivateHistoryId: PromptActivateHistoryId;
  }): Promise<PromptActivateHistories | null> {
    return this.promptActivateHistoryRepository.findByPromptActivateHistoryId(props.promptActivateHistoryId);
  }

  override async findMany(props: PromptActivateHistoryCriteriaFindMany): Promise<PromptActivateHistories[]> {
    const typeormOptions = RepositoryPromptActivateHistoryCriteriaMapper.toFindManyOptions(props);
    return this.promptActivateHistoryRepository.findMany(typeormOptions);
  }
}
