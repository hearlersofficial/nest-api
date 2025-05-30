import { PersonaPrompts, PersonaPromptsProps } from "~counselings/domains/personaPrompts/models/personaPrompts";

import { HttpStatus } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/PersonaPrompts.entity";
import dayjs from "dayjs";

export class PsqlPersonaPromptsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: PersonaPromptEntity): PersonaPrompts;
  static toDomain(entity: PersonaPromptEntity | null): PersonaPrompts | null;
  static toDomain(entity: PersonaPromptEntity | null): PersonaPrompts | null {
    if (!entity) {
      return null;
    }
    const personaPromptProps: PersonaPromptsProps = {
      counselorId: new UniqueEntityId(entity.counselorId),
      body: entity.body,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const personaPromptsOrError = PersonaPrompts.create(personaPromptProps, new UniqueEntityId(entity.id));
    if (personaPromptsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, personaPromptsOrError.errorValue);
    }
    return personaPromptsOrError.value;
  }

  static toDomains(entities: PersonaPromptEntity[]): PersonaPrompts[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(personaPrompts: PersonaPrompts): PersonaPromptEntity {
    const entity = new PersonaPromptEntity();

    if (!personaPrompts.id.isNewIdentifier()) {
      entity.id = personaPrompts.id.getString();
    }
    entity.counselorId = personaPrompts.counselorId.getString();
    entity.body = personaPrompts.body;
    entity.createdAt = personaPrompts.createdAt.toISOString();
    entity.updatedAt = personaPrompts.updatedAt.toISOString();
    entity.deletedAt = personaPrompts.deletedAt ? personaPrompts.deletedAt.toISOString() : null;
    return entity;
  }

  static toEntities(personaPrompts: PersonaPrompts[]): PersonaPromptEntity[] {
    return (personaPrompts ?? []).map((prompt) => this.toEntity(prompt));
  }
}
