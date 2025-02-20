import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { Contexts, ContextsProps } from "~counselings/aggregates/contexts/domain/contexts";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlContextMapper {
  static toDomain(entity: ContextEntity): Contexts | null {
    if (!entity) {
      return null;
    }

    const contextProps: ContextsProps = {
      name: entity.name,
      placeholders: entity.placeholders.split(","), // 플레이스홀더는 ,기준으로 구분된 문자열
      body: entity.body,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const contextsOrError = Contexts.create(contextProps, new UniqueEntityId(entity.id));

    if (contextsOrError.isFailure) {
      throw new InternalServerErrorException(contextsOrError.errorValue);
    }

    return contextsOrError.value;
  }

  static toEntity(contexts: Contexts): ContextEntity {
    const entity = new ContextEntity();

    entity.id = contexts.id.getString();
    entity.name = contexts.name;
    entity.placeholders = contexts.placeholders.join(","); // 플레이스홀더는 ,기준으로 구분된 문자열
    entity.body = contexts.body;

    entity.createdAt = formatDayjsToUtcString(contexts.createdAt);
    entity.updatedAt = formatDayjsToUtcString(contexts.updatedAt);
    entity.deletedAt = contexts.deletedAt ? formatDayjsToUtcString(contexts.deletedAt) : null;

    return entity;
  }
}
