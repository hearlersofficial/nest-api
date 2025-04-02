import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptByCounselorsEntity } from "~shared/core/infrastructure/entities/prompts/PromptByCounselors.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { PromptByCounselors, PromptByCounselorsProps } from "~counselings/domains/promptVersions/models/promptByCounselors";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlPromptByCounselorsMapper {
  static toDomain(entity: PromptByCounselorsEntity): PromptByCounselors | null {
    if (!entity) {
      return null;
    }

    const promptByCounselorsProps: PromptByCounselorsProps = {
      promptVersionId: new UniqueEntityId(entity.promptVersionId),
      counselorId: new UniqueEntityId(entity.counselorId),
      personaPromptId: new UniqueEntityId(entity.personaPromptId),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const promptByCounselorsOrError = PromptByCounselors.create(promptByCounselorsProps, new UniqueEntityId(entity.id));

    if (promptByCounselorsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, promptByCounselorsOrError.errorValue);
    }

    return promptByCounselorsOrError.value;
  }

  static toDomains(entities: PromptByCounselorsEntity[]): PromptByCounselors[] {
    if (entities.length === 0) {
      return [];
    }

    return entities.map((entity) => this.toDomain(entity)).filter(Boolean) as PromptByCounselors[];
  }

  static toEntity(promptByCounselors: PromptByCounselors): PromptByCounselorsEntity {
    const entity = new PromptByCounselorsEntity();

    if (!promptByCounselors.id.isNewIdentifier()) {
      entity.id = promptByCounselors.id.getString();
    }

    entity.promptVersionId = promptByCounselors.promptVersionId.getString();
    entity.counselorId = promptByCounselors.counselorId.getString();
    entity.personaPromptId = promptByCounselors.personaPromptId.getString();

    entity.createdAt = promptByCounselors.createdAt.toISOString();
    entity.updatedAt = promptByCounselors.updatedAt.toISOString();
    entity.deletedAt = promptByCounselors.deletedAt ? promptByCounselors.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(promptByCounselors: PromptByCounselors[]): PromptByCounselorsEntity[] {
    if (promptByCounselors.length === 0) {
      return [];
    }

    return promptByCounselors.map((prompt) => this.toEntity(prompt));
  }
}
