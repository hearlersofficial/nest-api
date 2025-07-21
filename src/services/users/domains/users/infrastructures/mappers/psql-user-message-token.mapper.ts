import { UserMessageTokens, UserMessageTokensProps } from "~users/domains/users/models/user-message-tokens";

import { HttpStatus } from "@nestjs/common";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/user-message-tokens.entity";
import dayjs from "dayjs";
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
      reservedTimeout: entity.reservedTimeout ? dayjs(entity.reservedTimeout) : null,
      resetInterval: entity.resetInterval,
      lastReset: dayjs(entity.lastReset),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const userMessageTokensOrError: Result<UserMessageTokens> = UserMessageTokens.create(
      userMessageTokensProps,
      new UniqueEntityId(entity.id),
    );

    if (userMessageTokensOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, userMessageTokensOrError.error as string);
    }

    return userMessageTokensOrError.value;
  }

  static toDomains(entities: UserMessageTokensEntity[] = []): UserMessageTokens[] {
    if (entities.length === 0 || !entities) {
      return [];
    }

    return entities.map((entity) => this.toDomain(entity)).filter(Boolean) as UserMessageTokens[];
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
    entity.reservedTimeout = userMessageTokens.reservedTimeout ? userMessageTokens.reservedTimeout.toISOString() : null;
    entity.resetInterval = userMessageTokens.resetInterval;
    entity.lastReset = userMessageTokens.lastReset.toISOString();
    entity.createdAt = userMessageTokens.createdAt.toISOString();
    entity.updatedAt = userMessageTokens.updatedAt.toISOString();
    entity.deletedAt = userMessageTokens.deletedAt ? userMessageTokens.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(userMessageTokens: UserMessageTokens[] = []): UserMessageTokensEntity[] {
    if (userMessageTokens.length === 0 || !userMessageTokens) {
      return [];
    }

    return userMessageTokens.map((userMessageToken) => this.toEntity(userMessageToken));
  }
}
