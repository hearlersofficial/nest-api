import { PromptActivateHistoriesNewProps } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history";
import { PromptActivateHistoryInfo } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history.info";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/prompt-activate-history/prompt-activate-history.criteria";
import { PromptActivateHistoryReader } from "~counselings/domains/prompt-activate-history/prompt-activate-history.reader";
import { PromptActivateHistoryStore } from "~counselings/domains/prompt-activate-history/prompt-activate-history.store";

import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PromptActivateHistoryService {
  constructor(
    private readonly promptActivateHistoryReader: PromptActivateHistoryReader,
    private readonly promptActivateHistoryPersister: PromptActivateHistoryStore,
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
