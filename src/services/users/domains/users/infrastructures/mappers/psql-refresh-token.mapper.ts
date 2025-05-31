import { RefreshTokens } from "~users/domains/auth-users/models/refresh-tokens";

import { HttpStatus } from "@nestjs/common";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { RefreshTokenEntity } from "~common/system/persistences/entities/users/RefreshTokens.entity";
import dayjs from "dayjs";

export class PsqlRefreshTokensMapper {
  static toDomain(entity: RefreshTokenEntity): RefreshTokens {
    if (!entity) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "refresh token entity is null");
    }
    const refreshTokenOrError: Result<RefreshTokens> = RefreshTokens.create(
      {
        token: entity.token,
        expiresAt: dayjs(entity.expiresAt),
        createdAt: dayjs(entity.createdAt),
        updatedAt: dayjs(entity.updatedAt),
        deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
      },
      new UniqueEntityId(entity.id),
    );
    if (refreshTokenOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, refreshTokenOrError.errorValue);
    }
    return refreshTokenOrError.value;
  }

  static toDomains(entities: RefreshTokenEntity[] = []): RefreshTokens[] {
    return entities.map((entity) => PsqlRefreshTokensMapper.toDomain(entity));
  }

  static toEntity(domain: RefreshTokens, authUserId: UniqueEntityId): RefreshTokenEntity {
    const entity = new RefreshTokenEntity();

    entity.id = domain.id.getString();
    entity.authUserId = authUserId.getString();
    entity.token = domain.token;
    entity.expiresAt = domain.expiresAt.toISOString();
    entity.createdAt = domain.createdAt.toISOString();
    entity.updatedAt = domain.updatedAt.toISOString();

    return entity;
  }

  static toEntities(domains: RefreshTokens[] = [], authUserId: UniqueEntityId): RefreshTokenEntity[] {
    return domains.map((domain) => this.toEntity(domain, authUserId));
  }
}
