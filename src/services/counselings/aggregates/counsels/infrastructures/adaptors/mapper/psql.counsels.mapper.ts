import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsEntity } from "~shared/core/infrastructure/entities/Counsels.entity";
import { Counsels, CounselsProps } from "~counselings/aggregates/counsels/domain/Counsels";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlCounselsMapper {
  static toDomain(entity: CounselsEntity): Counsels | null {
    if (!entity) {
      return null;
    }

    const counselProps: CounselsProps = {
      counselorId: new UniqueEntityId(entity.counselorId),
      userId: new UniqueEntityId(entity.userId),
      counselTechniqueId: new UniqueEntityId(entity.counselTechniqueId),
      lastMessage: entity.lastMessage,
      lastChatedAt: entity.lastChatedAt ? dayjs(entity.lastChatedAt) : null,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselsOrError: Result<Counsels> = Counsels.create(counselProps, new UniqueEntityId(entity.id));

    if (counselsOrError.isFailure) {
      throw new InternalServerErrorException(counselsOrError.errorValue);
    }

    return counselsOrError.value;
  }

  static toEntity(counsels: Counsels): CounselsEntity {
    const entity = new CounselsEntity();

    entity.id = counsels.id.getString();
    entity.counselorId = counsels.counselorId.getString();
    entity.userId = counsels.userId.getString();
    entity.counselTechniqueId = counsels.counselTechniqueId.getString();

    entity.lastMessage = counsels.lastMessage;
    entity.lastChatedAt = counsels.lastChatedAt ? counsels.lastChatedAt.toISOString() : null;

    entity.createdAt = counsels.createdAt.toISOString();
    entity.updatedAt = counsels.updatedAt.toISOString();
    entity.deletedAt = counsels.deletedAt ? counsels.deletedAt.toISOString() : null;

    return entity;
  }
}
