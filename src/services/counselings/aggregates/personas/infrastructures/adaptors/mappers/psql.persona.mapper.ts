import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PersonaEntity } from "~shared/core/infrastructure/entities/prompts/Personas.entity";
import { Personas, PersonasProps } from "~counselings/aggregates/personas/domain/personas";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlPersonasMapper {
  static toDomain(entity: PersonaEntity): Personas | null {
    if (!entity) {
      return null;
    }

    const personaProps: PersonasProps = {
      counselorId: new UniqueEntityId(entity.counselorId),
      body: entity.body,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const personasOrError = Personas.create(personaProps, new UniqueEntityId(entity.id));

    if (personasOrError.isFailure) {
      throw new InternalServerErrorException(personasOrError.errorValue);
    }

    return personasOrError.value;
  }

  static toEntity(personas: Personas): PersonaEntity {
    const entity = new PersonaEntity();

    entity.id = personas.id.getString();
    entity.counselorId = personas.counselorId.getString();
    entity.body = personas.body;
    entity.createdAt = personas.createdAt.toISOString();
    entity.updatedAt = personas.updatedAt.toISOString();
    entity.deletedAt = personas.deletedAt ? personas.deletedAt.toISOString() : null;

    return entity;
  }
}
