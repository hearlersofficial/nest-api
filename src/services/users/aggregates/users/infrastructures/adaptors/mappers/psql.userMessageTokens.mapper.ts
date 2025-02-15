import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UserMessageTokensEntity } from "~shared/core/infrastructure/entities/users/UserMessageTokens.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
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
      reservedTimeout: entity.reservedTimeout ? convertUtcStringToDayjs(entity.reservedTimeout) : null,
      resetInterval: entity.resetInterval,
      lastReset: convertUtcStringToDayjs(entity.lastReset),
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
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
      entity.id = userMessageTokens.id.getString();
    }
    if (!userMessageTokens.userId.isNewIdentifier()) {
      entity.userId = userMessageTokens.userId.getString();
    }

    entity.maxTokens = userMessageTokens.maxTokens;
    entity.remainingTokens = userMessageTokens.remainingTokens;
    entity.reserved = userMessageTokens.reserved;
    entity.reservedTimeout = userMessageTokens.reservedTimeout
      ? formatDayjsToUtcString(userMessageTokens.reservedTimeout)
      : null;
    entity.resetInterval = userMessageTokens.resetInterval;
    entity.lastReset = formatDayjsToUtcString(userMessageTokens.lastReset);
    entity.createdAt = formatDayjsToUtcString(userMessageTokens.createdAt);
    entity.updatedAt = formatDayjsToUtcString(userMessageTokens.updatedAt);
    entity.deletedAt = userMessageTokens.deletedAt ? formatDayjsToUtcString(userMessageTokens.deletedAt) : null;

    return entity;
  }

  static toEntities(userMessageTokens: UserMessageTokens[] = []): UserMessageTokensEntity[] {
    if (userMessageTokens.length === 0 || !userMessageTokens) {
      return [];
    }

    return userMessageTokens.map((userMessageToken) => this.toEntity(userMessageToken));
  }
}
