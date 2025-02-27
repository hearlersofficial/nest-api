import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { RefreshTokenEntity } from "~shared/core/infrastructure/entities/users/RefreshTokens.entity";
import { RefreshTokensVO } from "~users/aggregates/authUsers/domain/RefreshTokens.vo";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";
export class PsqlRefreshTokensMapper {
  static toVO(entity: RefreshTokenEntity): RefreshTokensVO {
    if (!entity) {
      return null;
    }
    const refreshTokenOrError: Result<RefreshTokensVO> = RefreshTokensVO.create({
      token: entity.token,
      expiresAt: dayjs(entity.expiresAt),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
    });
    if (refreshTokenOrError.isFailure) {
      throw new InternalServerErrorException(refreshTokenOrError.errorValue);
    }
    return refreshTokenOrError.value;
  }

  static toVOs(entities: RefreshTokenEntity[] = []): RefreshTokensVO[] {
    return entities.map((entity) => PsqlRefreshTokensMapper.toVO(entity));
  }

  static toEntity(refreshTokenVO: RefreshTokensVO, authUserId: UniqueEntityId): RefreshTokenEntity {
    const entity = new RefreshTokenEntity();

    entity.authUserId = authUserId.getString();
    entity.token = refreshTokenVO.token;
    entity.expiresAt = refreshTokenVO.expiresAt.toISOString();
    entity.createdAt = refreshTokenVO.createdAt.toISOString();
    entity.updatedAt = refreshTokenVO.updatedAt.toISOString();

    return entity;
  }

  static toEntities(refreshTokensVOs: RefreshTokensVO[] = [], authUserId: UniqueEntityId): RefreshTokenEntity[] {
    return refreshTokensVOs.map((refreshTokenVO) => this.toEntity(refreshTokenVO, authUserId));
  }
}
