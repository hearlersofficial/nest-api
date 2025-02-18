import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/CounselTechniques.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { CounselTechniques, CounselTechniquesProps } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlCounselTechniquesMapper {
  static toDomain(entity: CounselTechniquesEntity): CounselTechniques | null {
    if (!entity) {
      return null;
    }

    const counselTechniqueProps: CounselTechniquesProps = {
      name: entity.name,
      toneId: entity.toneId ? new UniqueEntityId(entity.toneId) : null,
      contextId: new UniqueEntityId(entity.contextId),
      instructionId: new UniqueEntityId(entity.instructionId),
      counselTechniqueStage: entity.counselTechniqueStage,
      nextTechniqueId: entity.nextTechniqueId ? new UniqueEntityId(entity.nextTechniqueId) : null,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const counselTechniquesOrError = CounselTechniques.create(counselTechniqueProps, new UniqueEntityId(entity.id));

    if (counselTechniquesOrError.isFailure) {
      throw new InternalServerErrorException(counselTechniquesOrError.errorValue);
    }

    return counselTechniquesOrError.value;
  }

  static toEntity(counselTechniques: CounselTechniques): CounselTechniquesEntity {
    const entity = new CounselTechniquesEntity();

    if (!counselTechniques.id.isNewIdentifier()) {
      entity.id = counselTechniques.id.getString();
    }

    entity.name = counselTechniques.name;
    entity.toneId = counselTechniques.toneId ? counselTechniques.toneId.getString() : null;
    entity.contextId = counselTechniques.contextId.getString();
    entity.instructionId = counselTechniques.instructionId.getString();
    entity.counselTechniqueStage = counselTechniques.counselTechniqueStage;
    entity.nextTechniqueId = counselTechniques.nextTechniqueId ? counselTechniques.nextTechniqueId.getString() : null;

    entity.createdAt = formatDayjsToUtcString(counselTechniques.createdAt);
    entity.updatedAt = formatDayjsToUtcString(counselTechniques.updatedAt);
    entity.deletedAt = counselTechniques.deletedAt ? formatDayjsToUtcString(counselTechniques.deletedAt) : null;

    return entity;
  }
}
