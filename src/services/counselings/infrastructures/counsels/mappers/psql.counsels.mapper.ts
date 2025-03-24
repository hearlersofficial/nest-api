import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { Counsels, CounselsProps } from "~counselings/domains/counsels/models/counsels";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlCounselsMapper {
  static toDomain(entity: CounselsEntity): Counsels | null {
    if (!entity) {
      return null;
    }

    const counselProps: CounselsProps = {
      userId: new UniqueEntityId(entity.userId),
      counselorId: new UniqueEntityId(entity.counselorId),
      counselTechniqueId: new UniqueEntityId(entity.counselTechniqueId),
      counselorUserRelationshipId: new UniqueEntityId(entity.counselorUserRelationshipId),
      lastChatedAt: entity.lastChatedAt ? dayjs(entity.lastChatedAt) : null,
      lastMessage: entity.lastMessage,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselsOrError = Counsels.create(counselProps, new UniqueEntityId(entity.id));

    if (counselsOrError.isFailure) {
      throw new InternalServerErrorException(counselsOrError.errorValue);
    }

    return counselsOrError.value;
  }

  static toDomains(entities: CounselsEntity[]): Counsels[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter((counsel) => counsel !== null);
  }

  static toEntity(counsels: Counsels): CounselsEntity {
    const entity = new CounselsEntity();

    entity.id = counsels.id.getString();
    entity.userId = counsels.userId.getString();
    entity.counselorId = counsels.counselorId.getString();
    entity.counselTechniqueId = counsels.counselTechniqueId.getString();
    entity.counselorUserRelationshipId = counsels.counselorUserRelationshipId.getString();

    entity.lastChatedAt = counsels.lastChatedAt ? counsels.lastChatedAt.toISOString() : null;
    entity.lastMessage = counsels.lastMessage;

    entity.createdAt = counsels.createdAt.toISOString();
    entity.updatedAt = counsels.updatedAt.toISOString();
    entity.deletedAt = counsels.deletedAt ? counsels.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(counsels: Counsels[]): CounselsEntity[] {
    if (counsels.length === 0) {
      return [];
    }

    return counsels.map((counsel) => this.toEntity(counsel));
  }
}
