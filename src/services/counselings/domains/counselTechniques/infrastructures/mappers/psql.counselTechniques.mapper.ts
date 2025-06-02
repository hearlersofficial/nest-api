import {
  CounselTechniques,
  CounselTechniquesProps,
} from "~counselings/domains/counselTechniques/models/counselTechniques";

import { HttpStatus } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/CounselTechniques.entity";
import dayjs from "dayjs";

export class PsqlCounselTechniquesMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselTechniquesEntity): CounselTechniques;
  static toDomain(entity: CounselTechniquesEntity | null): CounselTechniques | null;
  static toDomain(entity: CounselTechniquesEntity | null): CounselTechniques | null {
    if (!entity) {
      return null;
    }

    const counselTechniqueProps: CounselTechniquesProps = {
      name: entity.name,
      toneId: new UniqueEntityId(entity.toneId),
      context: entity.context,
      instruction: entity.instruction,
      messageThreshold: entity.messageThreshold,
      nextTechniqueId: entity.nextTechniqueId ? new UniqueEntityId(entity.nextTechniqueId) : null,
      isTemporary: entity.isTemporary,
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
    return (entities ?? []).map((entity) => this.toDomain(entity));
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

    entity.nextTechniqueId = counselTechniques.nextTechniqueId ? counselTechniques.nextTechniqueId.getString() : null;
    entity.isTemporary = counselTechniques.isTemporary;

    entity.createdAt = counselTechniques.createdAt.toISOString();
    entity.updatedAt = counselTechniques.updatedAt.toISOString();
    entity.deletedAt = counselTechniques.deletedAt ? counselTechniques.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(counselTechniques: CounselTechniques[]): CounselTechniquesEntity[] {
    return (counselTechniques ?? []).map((counsel) => this.toEntity(counsel));
  }
}
