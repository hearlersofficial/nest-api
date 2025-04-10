import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ToneScopedPromptsEntity } from "~shared/core/infrastructure/entities/prompts/ToneScopedPrompts.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { ToneScopedPrompts, ToneScopedPromptsProps } from "~counselings/domains/promptVersions/models/toneScopedPrompts";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlToneScopedPromptsMapper {
  static toDomain(entity: ToneScopedPromptsEntity): ToneScopedPrompts | null {
    if (!entity) {
      return null;
    }

    const toneScopedPromptProps: ToneScopedPromptsProps = {
      promptVersionId: new UniqueEntityId(entity.promptVersionId),
      toneId: new UniqueEntityId(entity.toneId),
      tonePromptId: entity.tonePromptId ? new UniqueEntityId(entity.tonePromptId) : null,
      firstCounselTechniqueId: entity.firstCounselTechniqueId ? new UniqueEntityId(entity.firstCounselTechniqueId) : null,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const toneScopedPromptOrError = ToneScopedPrompts.create(toneScopedPromptProps, new UniqueEntityId(entity.id));

    if (toneScopedPromptOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, toneScopedPromptOrError.errorValue);
    }

    return toneScopedPromptOrError.value;
  }

  static toDomains(entities: ToneScopedPromptsEntity[]): ToneScopedPrompts[] {
    if (entities.length === 0) {
      return [];
    }

    return entities.map((entity) => this.toDomain(entity)).filter(Boolean) as ToneScopedPrompts[];
  }

  static toEntity(promptByTones: ToneScopedPrompts): ToneScopedPromptsEntity {
    const entity = new ToneScopedPromptsEntity();

    if (!promptByTones.id.isNewIdentifier()) {
      entity.id = promptByTones.id.getString();
    }

    entity.promptVersionId = promptByTones.promptVersionId.getString();
    entity.toneId = promptByTones.toneId.getString();
    entity.tonePromptId = promptByTones.tonePromptId ? promptByTones.tonePromptId.getString() : null;
    entity.firstCounselTechniqueId = promptByTones.firstCounselTechniqueId ? promptByTones.firstCounselTechniqueId.getString() : null;

    entity.createdAt = promptByTones.createdAt.toISOString();
    entity.updatedAt = promptByTones.updatedAt.toISOString();
    entity.deletedAt = promptByTones.deletedAt ? promptByTones.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(promptByTones: ToneScopedPrompts[]): ToneScopedPromptsEntity[] {
    if (promptByTones.length === 0) {
      return [];
    }

    return promptByTones.map((prompt) => this.toEntity(prompt));
  }
}
