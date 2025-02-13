import { Result } from "~shared/core/domain/Result";
import { RefreshTokenEntity } from "~shared/core/infrastructure/entities/RefreshTokens.entity";
import { convertDayjs, formatDayjs } from "~shared/utils/Date.utils";
import { RefreshTokensVO } from "~users/aggregates/authUsers/domain/RefreshTokens.vo";

import { InternalServerErrorException } from "@nestjs/common";
<<<<<<< HEAD:src/services/users/aggregates/authUsers/infrastructures/adaptors/mappers/psql.refreshTokens.mapper.ts
=======
import { RefreshTokensVO } from "~/src/aggregates/authUsers/domain/RefreshTokens.vo";
import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { RefreshTokenEntity } from "~/src/shared/core/infrastructure/entities/users/RefreshTokens.entity";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/authUsers/infrastructures/adaptors/mappers/psql.refreshTokens.mapper.ts

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
