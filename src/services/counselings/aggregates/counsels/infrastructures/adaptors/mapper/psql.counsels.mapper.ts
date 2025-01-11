import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { CounselsEntity } from "~/src/shared/core/infrastructure/entities/Counsels.entity";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlCounselsMapper {
  static toDomain(entity: CounselsEntity): Counsels | null {
    if (!entity) {
      return null;
    }

    const counselProps = {
      counselorId: entity.counselorId,
      userId: entity.userId,
      counselStage: entity.counselStage,
      lastMessage: entity.lastMessage,
      lastChatedAt: entity.lastChatedAt ? convertDayjs(entity.lastChatedAt) : null,
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
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
      entity.id = counsels.id.getNumber();
    }

    entity.counselorId = counsels.counselorId;
    entity.userId = counsels.userId;
    entity.counselStage = counsels.counselStage;

    entity.lastMessage = counsels.lastMessage;
    entity.lastChatedAt = counsels.lastChatedAt ? formatDayjs(counsels.lastChatedAt) : null;

    entity.createdAt = formatDayjs(counsels.createdAt);
    entity.updatedAt = formatDayjs(counsels.updatedAt);
    entity.deletedAt = counsels.deletedAt ? formatDayjs(counsels.deletedAt) : null;

    return entity;
  }
}
