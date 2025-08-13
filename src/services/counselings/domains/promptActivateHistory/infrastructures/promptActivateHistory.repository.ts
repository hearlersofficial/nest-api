import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";

import { Injectable } from "@nestjs/common";
import { PromptActivateHistoryId } from "~common/shared-kernel/identifiers/prompt-activate-history.id";
import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/PromptActivateHistory.entity";
import { FindOneOptions } from "typeorm";

@Injectable()
export abstract class PromptActivateHistoryRepository {
  abstract findByPromptActivateHistoryId(
    promptActivateHistoryId: PromptActivateHistoryId,
    options?: FindOneOptions<PromptActivateHistoryEntity>,
  ): Promise<PromptActivateHistories | null>;
  abstract findMany(options?: FindOneOptions<PromptActivateHistoryEntity>): Promise<PromptActivateHistories[]>;
  abstract save(promptActivateHistory: PromptActivateHistories): Promise<PromptActivateHistories>;
  abstract save(promptActivateHistory: PromptActivateHistories[]): Promise<PromptActivateHistories[]>;
}
