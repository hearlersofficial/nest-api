import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UserProgressesEntity } from "~shared/core/infrastructure/entities/users/UserProgresses.entity";
import { UserProgresses } from "~users/aggregates/users/domain/UserProgresses";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";
export class PsqlUserProgressesMapper {
  static toDomain(entity: UserProgressesEntity): UserProgresses | null {
    if (!entity) {
      return null;
    }

    const userProgressesProps = {
      userId: new UniqueEntityId(entity.userId),
      progressType: entity.progressType,
      status: entity.status,
      lastUpdated: dayjs(entity.lastUpdated),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
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

  static toDomains(entities: UserProgressesEntity[]): UserProgresses[] {
    return entities.map((entity) => PsqlUserProgressesMapper.toDomain(entity)).filter(Boolean) as UserProgresses[];
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
    entity.lastUpdated = userProgresses.lastUpdated.toISOString();
    entity.createdAt = userProgresses.createdAt.toISOString();
    entity.updatedAt = userProgresses.updatedAt.toISOString();
    entity.deletedAt = userProgresses.deletedAt ? userProgresses.deletedAt.toISOString() : null;

    return entity;
  }
}
