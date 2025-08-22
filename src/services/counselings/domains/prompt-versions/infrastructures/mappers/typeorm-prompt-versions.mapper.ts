import { PromptVersions, PromptVersionsProps } from "~counselings/domains/prompt-versions/models/prompt-versions";

import { HttpStatus } from "@nestjs/common";
import { EntityData } from "~common/shared/utils/orm";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/prompt-versions.entity";
import dayjs from "dayjs";

export class TypeormPromptVersionsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: PromptVersionEntity): PromptVersions;
  static toDomain(entity: PromptVersionEntity | null): PromptVersions | null;
  static toDomain(entity: PromptVersionEntity | null): PromptVersions | null {
    if (!entity) {
      return null;
    }

    const promptVersionsProps: PromptVersionsProps = {
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      isTemporary: entity.isTemporary,
      isBookmarked: entity.isBookmarked,
      aiModel: entity.aiModel,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const promptVersionsOrError = PromptVersions.create(promptVersionsProps, new PromptVersionId(entity.id));
    if (promptVersionsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, promptVersionsOrError.errorValue);
    }

    return promptVersionsOrError.value;
  }

  static toDomains(entities: PromptVersionEntity[]): PromptVersions[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(promptVersions: PromptVersions): PromptVersionEntity {
    const entity = new PromptVersionEntity();

    if (!promptVersions.id.isNewIdentifier()) {
      entity.id = promptVersions.id.getString();
    }

    const mappedFields: EntityData<
      PromptVersionEntity,
      | "counselTechniques"
      | "counselTechniqueTransitionRules"
      | "personaPrompts"
      | "tonePrompts"
      | "counsels"
      | "promptActivateHistories"
    > = {
      id: promptVersions.id.getString(),
      name: promptVersions.name,
      description: promptVersions.description,
      isActive: promptVersions.isActive,
      isTemporary: promptVersions.isTemporary,
      isBookmarked: promptVersions.isBookmarked,
      aiModel: promptVersions.aiModel,
      createdAt: promptVersions.createdAt.toISOString(),
      updatedAt: promptVersions.updatedAt.toISOString(),
      deletedAt: promptVersions.deletedAt ? promptVersions.deletedAt.toISOString() : null,
    };

    Object.assign(entity, mappedFields);

    return entity;
  }

  static toEntities(promptVersions: PromptVersions[]): PromptVersionEntity[] {
    return (promptVersions ?? []).map((promptVersion) => this.toEntity(promptVersion));
  }
}
