import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { UserMessageTokensEntity } from "~/src/shared/core/infrastructure/entities/UserMessageTokens.entity";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
import { UserMessageTokens, UserMessageTokensProps } from "~users/aggregates/users/domain/UserMessageTokens";

import { HttpStatus } from "@nestjs/common";

export class PsqlUserMessageTokensMapper {
  static toDomain(entity: UserMessageTokensEntity): UserMessageTokens | null {
    if (!entity) {
      return null;
    }

    const userMessageTokensProps: UserMessageTokensProps = {
      userId: new UniqueEntityId(entity.userId),
      maxTokens: entity.maxTokens,
      remainingTokens: entity.remainingTokens,
      reserved: entity.reserved,
      reservedTimeout: entity.reservedTimeout ? convertDayjs(entity.reservedTimeout) : null,
      resetInterval: entity.resetInterval,
      lastReset: convertDayjs(entity.lastReset),
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
    };

    const userMessageTokensOrError: Result<UserMessageTokens> = UserMessageTokens.create(
      userMessageTokensProps,
      new UniqueEntityId(entity.id),
    );

    if (userMessageTokensOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, userMessageTokensOrError.error);
    }

    return userMessageTokensOrError.value;
  }

  static toDomains(entities: UserMessageTokensEntity[] = []): UserMessageTokens[] {
    if (entities.length === 0 || !entities) {
      return [];
    }

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(userMessageTokens: UserMessageTokens): UserMessageTokensEntity {
    const entity = new UserMessageTokensEntity();

    if (!userMessageTokens.id.isNewIdentifier()) {
      entity.id = userMessageTokens.id.getNumber();
    }
    if (!userMessageTokens.userId.isNewIdentifier()) {
      entity.userId = userMessageTokens.userId.getNumber();
    }

    entity.maxTokens = userMessageTokens.maxTokens;
    entity.remainingTokens = userMessageTokens.remainingTokens;
    entity.reserved = userMessageTokens.reserved;
    entity.reservedTimeout = userMessageTokens.reservedTimeout ? formatDayjs(userMessageTokens.reservedTimeout) : null;
    entity.resetInterval = userMessageTokens.resetInterval;
    entity.lastReset = formatDayjs(userMessageTokens.lastReset);
    entity.createdAt = formatDayjs(userMessageTokens.createdAt);
    entity.updatedAt = formatDayjs(userMessageTokens.updatedAt);
    entity.deletedAt = userMessageTokens.deletedAt ? formatDayjs(userMessageTokens.deletedAt) : null;

    return entity;
  }

  static toEntities(userMessageTokens: UserMessageTokens[] = []): UserMessageTokensEntity[] {
    if (userMessageTokens.length === 0 || !userMessageTokens) {
      return [];
    }

    return userMessageTokens.map((userMessageToken) => this.toEntity(userMessageToken));
  }
}
