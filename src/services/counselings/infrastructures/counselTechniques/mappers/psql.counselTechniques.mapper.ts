import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/prompts/CounselTechniques.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import {
  CounselTechniques,
  CounselTechniquesProps,
} from "~counselings/domains/counselTechniques/models/counselTechniques";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlCounselTechniquesMapper {
  static toDomain(entity: CounselTechniquesEntity): CounselTechniques | null {
    if (!entity) {
      return null;
    }

    const counselTechniqueProps: CounselTechniquesProps = {
      name: entity.name,
      toneId: new UniqueEntityId(entity.toneId),
      context: entity.context,
      instruction: entity.instruction,
      messageThreshold: entity.messageThreshold,
      prevTechniqueId: entity.prevTechniqueId ? new UniqueEntityId(entity.prevTechniqueId) : null,
      nextTechniqueId: entity.nextTechniqueId ? new UniqueEntityId(entity.nextTechniqueId) : null,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselTechniquesOrError = CounselTechniques.create(counselTechniqueProps, new UniqueEntityId(entity.id));

    if (counselTechniquesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselTechniquesOrError.errorValue);
    }

    return counselTechniquesOrError.value;
  }

  static toDomains(entities: CounselTechniquesEntity[]): CounselTechniques[] {
    if (entities.length === 0) {
      return [];
    }

    return entities.map((entity) => this.toDomain(entity)).filter(Boolean) as CounselTechniques[];
  }

  static toEntity(counselTechniques: CounselTechniques): CounselTechniquesEntity {
    const entity = new CounselTechniquesEntity();

    if (!counselTechniques.id.isNewIdentifier()) {
      entity.id = counselTechniques.id.getString();
    }

    entity.name = counselTechniques.name;
    entity.toneId = counselTechniques.toneId.getString();
    entity.context = counselTechniques.context;
    entity.instruction = counselTechniques.instruction;
    entity.messageThreshold = counselTechniques.messageThreshold;

    entity.prevTechniqueId = counselTechniques.prevTechniqueId ? counselTechniques.prevTechniqueId.getString() : null;
    entity.nextTechniqueId = counselTechniques.nextTechniqueId ? counselTechniques.nextTechniqueId.getString() : null;

    entity.createdAt = counselTechniques.createdAt.toISOString();
    entity.updatedAt = counselTechniques.updatedAt.toISOString();
    entity.deletedAt = counselTechniques.deletedAt ? counselTechniques.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(counselTechniques: CounselTechniques[]): CounselTechniquesEntity[] {
    if (counselTechniques.length === 0) {
      return [];
    }

    return counselTechniques.map((counsel) => this.toEntity(counsel));
  }
}
