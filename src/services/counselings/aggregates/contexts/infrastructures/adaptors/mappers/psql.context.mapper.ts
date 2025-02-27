import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { Contexts, ContextsProps } from "~counselings/aggregates/contexts/domain/contexts";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlContextMapper {
  static toDomain(entity: ContextEntity): Contexts | null {
    if (!entity) {
      return null;
    }

    const contextProps: ContextsProps = {
      name: entity.name,
      placeholders: entity.placeholders.split(","), // 플레이스홀더는 ,기준으로 구분된 문자열
      body: entity.body,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
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

    entity.createdAt = contexts.createdAt.toISOString();
    entity.updatedAt = contexts.updatedAt.toISOString();
    entity.deletedAt = contexts.deletedAt ? contexts.deletedAt.toISOString() : null;

    return entity;
  }
}
