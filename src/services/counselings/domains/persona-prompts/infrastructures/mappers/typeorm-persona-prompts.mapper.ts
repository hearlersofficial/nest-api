import { PersonaPrompts, PersonaPromptsProps } from "~counselings/domains/persona-prompts/models/persona-prompts";

import { HttpStatus } from "@nestjs/common";
import { EntityData } from "~common/shared/utils/orm";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/persona-prompts.entity";
import dayjs from "dayjs";

export class TypeormPersonaPromptsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: PersonaPromptEntity): PersonaPrompts;
  static toDomain(entity: PersonaPromptEntity | null): PersonaPrompts | null;
  static toDomain(entity: PersonaPromptEntity | null): PersonaPrompts | null {
    if (!entity) {
      return null;
    }
    const personaPromptProps: PersonaPromptsProps = {
      promptVersionId: new PromptVersionId(entity.promptVersionId),
      counselorId: new CounselorId(entity.counselorId),
      body: entity.body,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const personaPromptsOrError = PersonaPrompts.create(personaPromptProps, new PersonaPromptId(entity.id));
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

    const mappedFields: EntityData<PersonaPromptEntity, "promptVersion" | "counselor"> = {
      id: personaPrompts.id.getString(),
      promptVersionId: personaPrompts.promptVersionId.getString(),
      counselorId: personaPrompts.counselorId.getString(),
      body: personaPrompts.body,
      createdAt: personaPrompts.createdAt.toISOString(),
      updatedAt: personaPrompts.updatedAt.toISOString(),
      deletedAt: personaPrompts.deletedAt ? personaPrompts.deletedAt.toISOString() : null,
    };

    Object.assign(entity, mappedFields);

    return entity;
  }

  static toEntities(personaPrompts: PersonaPrompts[]): PersonaPromptEntity[] {
    return (personaPrompts ?? []).map((prompt) => this.toEntity(prompt));
  }
}
