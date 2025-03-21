import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PersonaEntity } from "~shared/core/infrastructure/entities/counselors/Personas.entity";
import { Personas, PersonasProps } from "~counselings/domains/counselors/models/personas";

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

  static toDomains(entities: PersonaEntity[]): Personas[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter((persona) => persona !== null);
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

  static toEntities(personas: Personas[]): PersonaEntity[] {
    if (personas.length === 0) {
      return [];
    }
    return personas.map((persona) => this.toEntity(persona));
  }
}
