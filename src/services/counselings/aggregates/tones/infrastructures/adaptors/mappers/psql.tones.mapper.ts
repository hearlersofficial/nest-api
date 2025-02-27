import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { Tones, TonesProps } from "~counselings/aggregates/tones/domain/tones";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlTonesMapper {
  public static toDomain(entity: ToneEntity): Tones | null {
    if (!entity) {
      return null;
    }

    const toneProps: TonesProps = {
      name: entity.name,
      body: entity.body,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const tonesOrError = Tones.create(toneProps, new UniqueEntityId(entity.id));

    if (tonesOrError.isFailure) {
      throw new InternalServerErrorException(tonesOrError.errorValue);
    }

    return tonesOrError.value;
  }

  public static toEntity(tones: Tones): ToneEntity {
    const entity = new ToneEntity();

    entity.id = tones.id.getString();
    entity.name = tones.name;
    entity.body = tones.body;
    entity.createdAt = tones.createdAt.toISOString();
    entity.updatedAt = tones.updatedAt.toISOString();
    entity.deletedAt = tones.deletedAt ? tones.deletedAt.toISOString() : null;

    return entity;
  }
}
