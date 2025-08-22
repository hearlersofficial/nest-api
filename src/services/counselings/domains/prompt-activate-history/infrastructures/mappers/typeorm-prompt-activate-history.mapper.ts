import {
  PromptActivateHistories,
  PromptActivateHistoriesProps,
} from "~counselings/domains/prompt-activate-history/models/prompt-activate-history";

import { PromptActivateHistoryId } from "~common/shared-kernel/identifiers/prompt-activate-history.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/prompt-activate-history.entity";
import dayjs from "dayjs";

export class TypeormPromptActivateHistoryMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: PromptActivateHistoryEntity): PromptActivateHistories;
  static toDomain(entity: PromptActivateHistoryEntity | null): PromptActivateHistories | null;
  static toDomain(entity: PromptActivateHistoryEntity | null): PromptActivateHistories | null {
    if (!entity) {
      return null;
    }
    const promptActivateHistoriesProps: PromptActivateHistoriesProps = {
      promptVersionId: new PromptVersionId(entity.promptVersionId),
      activatedAt: dayjs(entity.activatedAt),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const promptActivateHistoryOrError = PromptActivateHistories.create(
      promptActivateHistoriesProps,
      new PromptActivateHistoryId(entity.id),
    );
    if (promptActivateHistoryOrError.isFailure) {
      throw new Error(promptActivateHistoryOrError.errorValue);
    }
    return promptActivateHistoryOrError.value;
  }

  static toDomains(entities: PromptActivateHistoryEntity[]): PromptActivateHistories[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(promptActivateHistory: PromptActivateHistories): PromptActivateHistoryEntity {
    const entity = new PromptActivateHistoryEntity();

    if (!promptActivateHistory.id.isNewIdentifier()) {
      entity.id = promptActivateHistory.id.getString();
    }
    entity.promptVersionId = promptActivateHistory.promptVersionId.getString();
    entity.activatedAt = promptActivateHistory.activatedAt.toISOString();
    entity.createdAt = promptActivateHistory.createdAt.toISOString();
    entity.updatedAt = promptActivateHistory.updatedAt.toISOString();
    entity.deletedAt = promptActivateHistory.deletedAt ? promptActivateHistory.deletedAt.toISOString() : null;
    return entity;
  }

  static toEntities(promptActivateHistory: PromptActivateHistories[]): PromptActivateHistoryEntity[] {
    return (promptActivateHistory ?? []).map((history) => this.toEntity(history));
  }
}
