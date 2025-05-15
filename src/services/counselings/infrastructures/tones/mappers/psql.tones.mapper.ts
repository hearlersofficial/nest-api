import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ToneEntity } from "~shared/core/infrastructure/entities/counselors/tone.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { Tones, TonesProps } from "~counselings/domains/tones/models/tones";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlTonesMapper {
  static toDomain(entity: ToneEntity): Tones | null {
    if (!entity) {
      return null;
    }

    const toneProps: TonesProps = {
      name: entity.name,
      description: entity.description,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const tonesOrError = Tones.create(toneProps, new UniqueEntityId(entity.id));

    if (tonesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, tonesOrError.errorValue);
    }

    return tonesOrError.value;
  }

  static toDomains(entities: ToneEntity[]): Tones[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter((tone) => tone !== null);
  }

  static toEntity(tones: Tones): ToneEntity {
    const entity = new ToneEntity();

    entity.id = tones.id.getString();
    entity.name = tones.name;
    entity.description = tones.description;
    entity.createdAt = tones.createdAt.toISOString();
    entity.updatedAt = tones.updatedAt.toISOString();
    entity.deletedAt = tones.deletedAt ? tones.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(tones: Tones[]): ToneEntity[] {
    if (tones.length === 0) {
      return [];
    }

    return tones.map((tone) => this.toEntity(tone));
  }
}
