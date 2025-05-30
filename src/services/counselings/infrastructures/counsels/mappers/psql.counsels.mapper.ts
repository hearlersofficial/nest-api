import { Counsels, CounselsProps } from "~counselings/domains/counsels/models/counsels";

import { HttpStatus } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselsEntity } from "~common/system/persistences/entities/councels/Counsels.entity";
import dayjs from "dayjs";

export class PsqlCounselsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselsEntity): Counsels;
  static toDomain(entity: CounselsEntity | null): Counsels | null;
  static toDomain(entity: CounselsEntity | null): Counsels | null {
    if (!entity) {
      return null;
    }

    const counselProps: CounselsProps = {
      userId: new UniqueEntityId(entity.userId),
      counselorId: new UniqueEntityId(entity.counselorId),
      counselTechniqueId: new UniqueEntityId(entity.counselTechniqueId),
      promptVersionId: new UniqueEntityId(entity.promptVersionId),
      counselorUserRelationshipId: new UniqueEntityId(entity.counselorUserRelationshipId),
      lastChatedAt: entity.lastChatedAt ? dayjs(entity.lastChatedAt) : null,
      lastMessage: entity.lastMessage,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselsOrError = Counsels.create(counselProps, new UniqueEntityId(entity.id));

    if (counselsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselsOrError.errorValue);
    }

    return counselsOrError.value;
  }

  static toDomains(entities: CounselsEntity[]): Counsels[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(counsels: Counsels): CounselsEntity {
    const entity = new CounselsEntity();

    entity.id = counsels.id.getString();
    entity.userId = counsels.userId.getString();
    entity.counselorId = counsels.counselorId.getString();
    entity.counselTechniqueId = counsels.counselTechniqueId.getString();
    entity.promptVersionId = counsels.promptVersionId.getString();
    entity.counselorUserRelationshipId = counsels.counselorUserRelationshipId.getString();

    entity.lastChatedAt = counsels.lastChatedAt ? counsels.lastChatedAt.toISOString() : null;
    entity.lastMessage = counsels.lastMessage;

    entity.createdAt = counsels.createdAt.toISOString();
    entity.updatedAt = counsels.updatedAt.toISOString();
    entity.deletedAt = counsels.deletedAt ? counsels.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(counsels: Counsels[]): CounselsEntity[] {
    return (counsels ?? []).map((counsel) => this.toEntity(counsel));
  }
}
