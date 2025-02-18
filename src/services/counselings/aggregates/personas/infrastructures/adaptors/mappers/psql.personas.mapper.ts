import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PersonaEntity } from "~shared/core/infrastructure/entities/prompts/Personas.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { Personas, PersonasProps } from "~counselings/aggregates/personas/domain/personas";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlPersonasMapper {
  static toDomain(entity: PersonaEntity): Personas | null {
    if (!entity) {
      return null;
    }

    const personaProps: PersonasProps = {
      counselorId: new UniqueEntityId(entity.counselorId),
      body: entity.body,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const personasOrError = Personas.create(personaProps, new UniqueEntityId(entity.id));

    if (personasOrError.isFailure) {
      throw new InternalServerErrorException(personasOrError.errorValue);
    }

    return personasOrError.value;
  }

  static toEntity(personas: Personas): PersonaEntity {
    const entity = new PersonaEntity();

    if (!personas.id.isNewIdentifier()) {
      entity.id = personas.id.getString();
    }

    entity.counselorId = personas.counselorId.getString();
    entity.body = personas.body;

    entity.createdAt = formatDayjsToUtcString(personas.createdAt);
    entity.updatedAt = formatDayjsToUtcString(personas.updatedAt);
    entity.deletedAt = personas.deletedAt ? formatDayjsToUtcString(personas.deletedAt) : null;

    return entity;
  }
}
