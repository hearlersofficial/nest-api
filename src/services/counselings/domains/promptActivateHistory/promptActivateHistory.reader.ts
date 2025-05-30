import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/promptActivateHistory/promptActivateHistory.criteria";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";

@Injectable()
export abstract class PromptActivateHistoryReader {
  abstract findOne(props: { promptActivateHistoryId: UniqueEntityId }): Promise<PromptActivateHistories | null>;
  abstract findMany(props: PromptActivateHistoryCriteriaFindMany): Promise<PromptActivateHistories[]>;
}
