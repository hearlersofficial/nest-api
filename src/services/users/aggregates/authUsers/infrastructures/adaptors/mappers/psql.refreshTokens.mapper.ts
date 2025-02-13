import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { RefreshTokenEntity } from "~shared/core/infrastructure/entities/users/RefreshTokens.entity";
import { convertDayjs, formatDayjs } from "~shared/utils/Date.utils";
import { RefreshTokensVO } from "~users/aggregates/authUsers/domain/RefreshTokens.vo";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlRefreshTokensMapper {
  static toVO(entity: RefreshTokenEntity): RefreshTokensVO {
    if (!entity) {
      return null;
    }
    const refreshTokenOrError: Result<RefreshTokensVO> = RefreshTokensVO.create({
      token: entity.token,
      expiresAt: convertDayjs(entity.expiresAt),
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
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
    entity.expiresAt = formatDayjs(refreshTokenVO.expiresAt);
    entity.createdAt = formatDayjs(refreshTokenVO.createdAt);
    entity.updatedAt = formatDayjs(refreshTokenVO.updatedAt);

    return entity;
  }

  static toEntities(refreshTokensVOs: RefreshTokensVO[] = [], authUserId: UniqueEntityId): RefreshTokenEntity[] {
    return refreshTokensVOs.map((refreshTokenVO) => this.toEntity(refreshTokenVO, authUserId));
  }
}
