import { PromptActivateHistoriesNewProps } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { PromptActivateHistoryInfo } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory.info";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/promptActivateHistory/promptActivateHistory.criteria";
import { PromptActivateHistoryPersister } from "~counselings/domains/promptActivateHistory/promptActivateHistory.persister";
import { PromptActivateHistoryReader } from "~counselings/domains/promptActivateHistory/promptActivateHistory.reader";

import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PromptActivateHistoryService {
  constructor(
    private readonly promptActivateHistoryReader: PromptActivateHistoryReader,
    private readonly promptActivateHistoryPersister: PromptActivateHistoryPersister,
  ) {}

  @Transactional()
  async create(promptActivateHistory: PromptActivateHistoriesNewProps): Promise<PromptActivateHistoryInfo> {
    const history = await this.promptActivateHistoryPersister.create(promptActivateHistory);
    return PromptActivateHistoryInfo.fromDomain(history);
  }

  async getMany(props: PromptActivateHistoryCriteriaFindMany): Promise<PromptActivateHistoryInfo[]> {
    const histories = await this.promptActivateHistoryReader.findMany(props);
    return PromptActivateHistoryInfo.fromDomainArray(histories);
  }
}
