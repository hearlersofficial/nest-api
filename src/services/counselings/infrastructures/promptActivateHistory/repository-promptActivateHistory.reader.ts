import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/promptActivateHistory/promptActivateHistory.criteria";
import { PromptActivateHistoryReader } from "~counselings/domains/promptActivateHistory/promptActivateHistory.reader";
import { RepositoryPromptActivateHistoryCriteriaMapper } from "~counselings/infrastructures/promptActivateHistory/mappers/repository-promptActivateHistory-criteria.mapper";
import { PromptActivateHistoryRepository } from "~counselings/infrastructures/promptActivateHistory/promptActivateHistory.repository";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryPromptActivateHistoryReader extends PromptActivateHistoryReader {
  constructor(private readonly promptActivateHistoryRepository: PromptActivateHistoryRepository) {
    super();
  }

  override async findOne(props: { promptActivateHistoryId: UniqueEntityId }): Promise<PromptActivateHistories | null> {
    return this.promptActivateHistoryRepository.findByPromptActivateHistoryId(props.promptActivateHistoryId);
  }

  override async findMany(props: PromptActivateHistoryCriteriaFindMany): Promise<PromptActivateHistories[]> {
    const typeormOptions = RepositoryPromptActivateHistoryCriteriaMapper.toFindManyOptions(props);
    return this.promptActivateHistoryRepository.findMany(typeormOptions);
  }
}
