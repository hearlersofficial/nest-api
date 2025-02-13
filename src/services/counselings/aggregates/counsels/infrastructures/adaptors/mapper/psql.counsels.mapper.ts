import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsEntity } from "~shared/core/infrastructure/entities/Counsels.entity";
import { convertDayjs, formatDayjs } from "~shared/utils/Date.utils";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

import { InternalServerErrorException } from "@nestjs/common";
<<<<<<< HEAD:src/services/counselings/aggregates/counsels/infrastructures/adaptors/mapper/psql.counsels.mapper.ts
=======
import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
import { CounselsEntity } from "~/src/shared/core/infrastructure/entities/Counsels.entity";
import { Counsels, CounselsProps } from "~/src/aggregates/counsels/domain/Counsels";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counsels/infrastructures/adaptors/mapper/psql.counsels.mapper.ts

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
      entity.id = counsels.id.getString();
    }

    entity.counselorId = counsels.counselorId.getString();
    entity.userId = counsels.userId.getString();
    entity.counselStage = counsels.counselStage;

    entity.lastMessage = counsels.lastMessage;
    entity.lastChatedAt = counsels.lastChatedAt ? formatDayjs(counsels.lastChatedAt) : null;

    entity.createdAt = formatDayjs(counsels.createdAt);
    entity.updatedAt = formatDayjs(counsels.updatedAt);
    entity.deletedAt = counsels.deletedAt ? formatDayjs(counsels.deletedAt) : null;

    return entity;
  }
}
