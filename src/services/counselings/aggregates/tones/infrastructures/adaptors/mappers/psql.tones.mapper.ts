import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { Tones, TonesProps } from "~counselings/aggregates/tones/domain/tones";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlTonesMapper {
  public static toDomain(entity: ToneEntity): Tones | null {
    if (!entity) {
      return null;
    }

    const toneProps: TonesProps = {
      name: entity.name,
      body: entity.body,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const tonesOrError = Tones.create(toneProps, new UniqueEntityId(entity.id));

    if (tonesOrError.isFailure) {
      throw new InternalServerErrorException(tonesOrError.errorValue);
    }

    return tonesOrError.value;
  }

  public static toEntity(tones: Tones): ToneEntity {
    const entity = new ToneEntity();

    if (!tones.id.isNewIdentifier()) {
      entity.id = tones.id.getString();
    }

    entity.name = tones.name;
    entity.body = tones.body;

    entity.createdAt = formatDayjsToUtcString(tones.createdAt);
    entity.updatedAt = formatDayjsToUtcString(tones.updatedAt);
    entity.deletedAt = tones.deletedAt ? formatDayjsToUtcString(tones.deletedAt) : null;

    return entity;
  }
}
