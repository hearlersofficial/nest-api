import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UserProgressesEntity } from "~shared/core/infrastructure/entities/users/UserProgresses.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { UserProgresses } from "~users/aggregates/users/domain/UserProgresses";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlUserProgressesMapper {
  static toDomain(entity: UserProgressesEntity): UserProgresses | null {
    if (!entity) {
      return null;
    }

    const userProgressesProps = {
      userId: new UniqueEntityId(entity.userId),
      progressType: entity.progressType,
      status: entity.status,
      lastUpdated: convertUtcStringToDayjs(entity.lastUpdated),
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
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
    entity.lastUpdated = formatDayjsToUtcString(userProgresses.lastUpdated);
    entity.createdAt = formatDayjsToUtcString(userProgresses.createdAt);
    entity.updatedAt = formatDayjsToUtcString(userProgresses.updatedAt);
    entity.deletedAt = userProgresses.deletedAt ? formatDayjsToUtcString(userProgresses.deletedAt) : null;

    return entity;
  }
}
