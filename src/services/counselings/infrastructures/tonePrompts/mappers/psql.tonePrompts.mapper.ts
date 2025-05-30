import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { TonePromptEntity } from "~shared/core/infrastructure/entities/prompts/TonePrompts.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { TonePrompts, TonePromptsProps } from "~counselings/domains/tonePrompts/models/tonePrompts";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlTonePromptsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: TonePromptEntity): TonePrompts;
  static toDomain(entity: TonePromptEntity | null): TonePrompts | null;
  static toDomain(entity: TonePromptEntity | null): TonePrompts | null {
    if (!entity) {
      return null;
    }
    const tonePromptProps: TonePromptsProps = {
      toneId: new UniqueEntityId(entity.toneId),
      body: entity.body,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const tonePromptsOrError = TonePrompts.create(tonePromptProps, new UniqueEntityId(entity.id));
    if (tonePromptsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, tonePromptsOrError.errorValue);
    }
    return tonePromptsOrError.value;
  }

  static toDomains(entities: TonePromptEntity[]): TonePrompts[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(tonePrompts: TonePrompts): TonePromptEntity {
    const entity = new TonePromptEntity();

    if (!tonePrompts.id.isNewIdentifier()) {
      entity.id = tonePrompts.id.getString();
    }
    entity.toneId = tonePrompts.toneId.getString();
    entity.body = tonePrompts.body;
    entity.createdAt = tonePrompts.createdAt.toISOString();
    entity.updatedAt = tonePrompts.updatedAt.toISOString();
    entity.deletedAt = tonePrompts.deletedAt ? tonePrompts.deletedAt.toISOString() : null;
    return entity;
  }

  static toEntities(tonePrompts: TonePrompts[]): TonePromptEntity[] {
    return (tonePrompts ?? []).map((prompt) => this.toEntity(prompt));
  }
}
