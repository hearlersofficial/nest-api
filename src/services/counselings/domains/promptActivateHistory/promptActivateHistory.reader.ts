import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/promptActivateHistory/promptActivateHistory.criteria";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PromptActivateHistoryReader {
  abstract findOne(props: { promptActivateHistoryId: UniqueEntityId }): Promise<PromptActivateHistories | null>;
  abstract findMany(props: PromptActivateHistoryCriteriaFindMany): Promise<PromptActivateHistories[]>;
}
