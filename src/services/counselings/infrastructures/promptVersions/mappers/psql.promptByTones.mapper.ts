import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptByTonesEntity } from "~shared/core/infrastructure/entities/prompts/PromptByTones.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { PromptByTones, PromptByTonesProps } from "~counselings/domains/promptVersions/models/promptByTones";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlPromptByTonesMapper {
  static toDomain(entity: PromptByTonesEntity): PromptByTones | null {
    if (!entity) {
      return null;
    }

    const promptByTonesProps: PromptByTonesProps = {
      promptVersionId: new UniqueEntityId(entity.promptVersionId),
      toneId: new UniqueEntityId(entity.toneId),
      tonePromptId: entity.tonePromptId ? new UniqueEntityId(entity.tonePromptId) : null,
      firstCounselTechniqueId: entity.firstCounselTechniqueId ? new UniqueEntityId(entity.firstCounselTechniqueId) : null,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const promptByTonesOrError = PromptByTones.create(promptByTonesProps, new UniqueEntityId(entity.id));

    if (promptByTonesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, promptByTonesOrError.errorValue);
    }

    return promptByTonesOrError.value;
  }

  static toDomains(entities: PromptByTonesEntity[]): PromptByTones[] {
    if (entities.length === 0) {
      return [];
    }

    return entities.map((entity) => this.toDomain(entity)).filter(Boolean) as PromptByTones[];
  }

  static toEntity(promptByTones: PromptByTones): PromptByTonesEntity {
    const entity = new PromptByTonesEntity();

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

  static toEntities(promptByTones: PromptByTones[]): PromptByTonesEntity[] {
    if (promptByTones.length === 0) {
      return [];
    }

    return promptByTones.map((prompt) => this.toEntity(prompt));
  }
}
