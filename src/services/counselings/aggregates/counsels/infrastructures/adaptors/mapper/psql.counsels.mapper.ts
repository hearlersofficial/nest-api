import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsEntity } from "~shared/core/infrastructure/entities/Counsels.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { Counsels, CounselsProps } from "~counselings/aggregates/counsels/domain/Counsels";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlCounselsMapper {
  static toDomain(entity: CounselsEntity): Counsels | null {
    if (!entity) {
      return null;
    }

    const counselProps: CounselsProps = {
      counselorId: new UniqueEntityId(entity.counselorId),
      userId: new UniqueEntityId(entity.userId),
      counselStage: entity.counselStage,
      lastMessage: entity.lastMessage,
      lastChatedAt: entity.lastChatedAt ? convertUtcStringToDayjs(entity.lastChatedAt) : null,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const counselsOrError: Result<Counsels> = Counsels.create(counselProps, new UniqueEntityId(entity.id));

    if (counselsOrError.isFailure) {
      throw new InternalServerErrorException(counselsOrError.errorValue);
    }

    return counselsOrError.value;
  }

  static toEntity(counsels: Counsels): CounselsEntity {
    const entity = new CounselsEntity();

    if (!counsels.id.isNewIdentifier()) {
      entity.id = counsels.id.getString();
    }

    entity.counselorId = counsels.counselorId.getString();
    entity.userId = counsels.userId.getString();
    entity.counselStage = counsels.counselStage;

    entity.lastMessage = counsels.lastMessage;
    entity.lastChatedAt = counsels.lastChatedAt ? formatDayjsToUtcString(counsels.lastChatedAt) : null;

    entity.createdAt = formatDayjsToUtcString(counsels.createdAt);
    entity.updatedAt = formatDayjsToUtcString(counsels.updatedAt);
    entity.deletedAt = counsels.deletedAt ? formatDayjsToUtcString(counsels.deletedAt) : null;

    return entity;
  }
}
