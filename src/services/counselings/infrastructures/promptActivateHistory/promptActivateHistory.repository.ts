import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptActivateHistoryEntity } from "~shared/core/infrastructure/entities/prompts/PromptActivateHistory.entity";
import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";

import { Injectable } from "@nestjs/common";
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
