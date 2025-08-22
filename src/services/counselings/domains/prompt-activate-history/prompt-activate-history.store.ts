import {
  PromptActivateHistories,
  PromptActivateHistoriesNewProps,
} from "~counselings/domains/prompt-activate-history/models/prompt-activate-history";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PromptActivateHistoryStore {
  abstract create(promptActivateHistory: PromptActivateHistoriesNewProps): Promise<PromptActivateHistories>;
  abstract update(promptActivateHistory: PromptActivateHistories): Promise<PromptActivateHistories>;
  abstract updateMany(promptActivateHistories: PromptActivateHistories[]): Promise<PromptActivateHistories[]>;
}
