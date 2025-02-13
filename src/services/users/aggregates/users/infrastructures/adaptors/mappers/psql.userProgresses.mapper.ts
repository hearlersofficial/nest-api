import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UserProgressesEntity } from "~shared/core/infrastructure/entities/UserProgresses.entity";
import { convertDayjs, formatDayjs } from "~shared/utils/Date.utils";
import { UserProgresses } from "~users/aggregates/users/domain/UserProgresses";

import { InternalServerErrorException } from "@nestjs/common";
<<<<<<< HEAD:src/services/users/aggregates/users/infrastructures/adaptors/mappers/psql.userProgresses.mapper.ts
=======
import { UserProgresses } from "~/src/aggregates/users/domain/UserProgresses";
import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { UserProgressesEntity } from "~/src/shared/core/infrastructure/entities/users/UserProgresses.entity";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/infrastructures/adaptors/mappers/psql.userProgresses.mapper.ts

export class PsqlUserProgressesMapper {
  static toDomain(entity: UserProgressesEntity): UserProgresses | null {
    if (!entity) {
      return null;
    }

    const userProgressesProps = {
      userId: new UniqueEntityId(entity.userId),
      progressType: entity.progressType,
      status: entity.status,
      lastUpdated: convertDayjs(entity.lastUpdated),
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
    };

    const userProgressesOrError: Result<UserProgresses> = UserProgresses.create(
      userProgressesProps,
      new UniqueEntityId(entity.id),
    );

    if (userProgressesOrError.isFailure) {
      throw new InternalServerErrorException(userProgressesOrError.errorValue);
    }

    return userProgressesOrError.value;
  }

  static toEntity(userProgresses: UserProgresses): UserProgressesEntity {
    const entity = new UserProgressesEntity();

    if (!userProgresses.id.isNewIdentifier()) {
      entity.id = userProgresses.id.getString();
    }
    if (!userProgresses.userId.isNewIdentifier()) {
      entity.userId = userProgresses.userId.getString();
    }

    entity.progressType = userProgresses.progressType;
    entity.status = userProgresses.status;
    entity.lastUpdated = formatDayjs(userProgresses.lastUpdated);
    entity.createdAt = formatDayjs(userProgresses.createdAt);
    entity.updatedAt = formatDayjs(userProgresses.updatedAt);
    entity.deletedAt = userProgresses.deletedAt ? formatDayjs(userProgresses.deletedAt) : null;

    return entity;
  }
}
