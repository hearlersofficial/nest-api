import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { PromptByCounselors } from "~counselings/domains/promptVersions/models/promptByCounselors";
import { PromptByTones } from "~counselings/domains/promptVersions/models/promptByTones";
import { PromptVersions, PromptVersionsProps } from "~counselings/domains/promptVersions/models/promptVersions";
import { PsqlPromptByCounselorsMapper } from "~counselings/infrastructures/promptVersions/mappers/psql.promptByCounselors.mapper";
import { PsqlPromptByTonesMapper } from "~counselings/infrastructures/promptVersions/mappers/psql.promptByTones.mapper";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlPromptVersionsMapper {
  static toDomain(entity: PromptVersionEntity): PromptVersions | null {
    if (!entity) {
      return null;
    }

    const promptByCounselors: PromptByCounselors[] = PsqlPromptByCounselorsMapper.toDomains(entity.promptByCounselors);
    const promptByTones: PromptByTones[] = PsqlPromptByTonesMapper.toDomains(entity.promptByTones);

    const promptVersionsProps: PromptVersionsProps = {
      name: entity.name,
      description: entity.description,
      promptByCounselors: promptByCounselors,
      promptByTones: promptByTones,
      isActive: entity.isActive,
      isTemporary: entity.isTemporary,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const promptVersionsOrError = PromptVersions.create(promptVersionsProps, new UniqueEntityId(entity.id));
    if (promptVersionsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, promptVersionsOrError.errorValue);
    }

    return promptVersionsOrError.value;
  }

  static toDomains(entities: PromptVersionEntity[]): PromptVersions[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter(Boolean) as PromptVersions[];
  }

  static toEntity(promptVersions: PromptVersions): PromptVersionEntity {
    const entity = new PromptVersionEntity();

    if (!promptVersions.id.isNewIdentifier()) {
      entity.id = promptVersions.id.getString();
    }

    entity.promptByCounselors = PsqlPromptByCounselorsMapper.toEntities(promptVersions.promptByCounselors);
    entity.promptByTones = PsqlPromptByTonesMapper.toEntities(promptVersions.promptByTones);

    entity.name = promptVersions.name;
    entity.description = promptVersions.description;
    entity.isActive = promptVersions.isActive;
    entity.isTemporary = promptVersions.isTemporary;

    entity.createdAt = promptVersions.createdAt.toISOString();
    entity.updatedAt = promptVersions.updatedAt.toISOString();
    entity.deletedAt = promptVersions.deletedAt ? promptVersions.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(promptVersions: PromptVersions[]): PromptVersionEntity[] {
    if (promptVersions.length === 0) {
      return [];
    }
    return promptVersions.map((promptVersion) => this.toEntity(promptVersion));
  }
}
