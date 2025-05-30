import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/PromptActivateHistory.entity";
import { FindOneOptions } from "typeorm";

@Injectable()
export abstract class PromptActivateHistoryRepository {
  abstract findByPromptActivateHistoryId(
    promptActivateHistoryId: UniqueEntityId,
    options?: FindOneOptions<PromptActivateHistoryEntity>,
  ): Promise<PromptActivateHistories | null>;
  abstract findMany(options?: FindOneOptions<PromptActivateHistoryEntity>): Promise<PromptActivateHistories[]>;
  abstract save(promptActivateHistory: PromptActivateHistories): Promise<PromptActivateHistories>;
  abstract save(promptActivateHistory: PromptActivateHistories[]): Promise<PromptActivateHistories[]>;
}
