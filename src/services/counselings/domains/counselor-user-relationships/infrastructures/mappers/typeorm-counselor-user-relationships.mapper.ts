import {
  CounselorUserRelationships,
  CounselorUserRelationshipsProps,
} from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { HttpStatus } from "@nestjs/common";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselorUserRelationshipsEntity } from "~common/system/persistences/entities/counsels/counselor-user-relationships.entity";
import dayjs from "dayjs";

export class TypeormCounselorUserRelationshipsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselorUserRelationshipsEntity): CounselorUserRelationships;
  static toDomain(entity: CounselorUserRelationshipsEntity | null): CounselorUserRelationships | null;
  static toDomain(entity: CounselorUserRelationshipsEntity | null): CounselorUserRelationships | null {
    if (!entity) {
      return null;
    }

    const relationshipProps: CounselorUserRelationshipsProps = {
      userId: new UserId(entity.userId),
      counselorId: new CounselorId(entity.counselorId),
      rapport: entity.rapport,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const relationshipOrError = CounselorUserRelationships.create(
      relationshipProps,
      new CounselorUserRelationshipId(entity.id),
    );

    if (relationshipOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, relationshipOrError.errorValue);
    }

    return relationshipOrError.value;
  }

  static toDomains(entities: CounselorUserRelationshipsEntity[]): CounselorUserRelationships[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(relationship: CounselorUserRelationships): CounselorUserRelationshipsEntity {
    const entity = new CounselorUserRelationshipsEntity();

    entity.id = relationship.id.getString();
    entity.userId = relationship.userId.getString();
    entity.counselorId = relationship.counselorId.getString();
    entity.rapport = relationship.rapport;
    entity.createdAt = relationship.createdAt.toISOString();
    entity.updatedAt = relationship.updatedAt.toISOString();
    entity.deletedAt = relationship.deletedAt ? relationship.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(relationships: CounselorUserRelationships[]): CounselorUserRelationshipsEntity[] {
    return (relationships ?? []).map((relationship) => this.toEntity(relationship));
  }
}
