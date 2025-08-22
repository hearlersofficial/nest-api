import { PromptActivateHistories } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history";
import { PromptActivateHistoryCriteriaFindMany } from "~counselings/domains/prompt-activate-history/prompt-activate-history.criteria";

import { Injectable } from "@nestjs/common";
import { PromptActivateHistoryId } from "~common/shared-kernel/identifiers/prompt-activate-history.id";

@Injectable()
export abstract class PromptActivateHistoryReader {
  abstract findOne(props: {
    promptActivateHistoryId: PromptActivateHistoryId;
  }): Promise<PromptActivateHistories | null>;
  abstract findMany(props: PromptActivateHistoryCriteriaFindMany): Promise<PromptActivateHistories[]>;
}
