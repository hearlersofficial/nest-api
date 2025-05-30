import {
  PromptActivateHistories,
  PromptActivateHistoriesNewProps,
} from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PromptActivateHistoryPersister {
  abstract create(promptActivateHistory: PromptActivateHistoriesNewProps): Promise<PromptActivateHistories>;
  abstract update(promptActivateHistory: PromptActivateHistories): Promise<PromptActivateHistories>;
  abstract updateMany(promptActivateHistories: PromptActivateHistories[]): Promise<PromptActivateHistories[]>;
}
