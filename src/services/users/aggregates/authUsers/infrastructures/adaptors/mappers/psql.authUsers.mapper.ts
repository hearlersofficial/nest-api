import { CoreStatus } from "~shared/core/constants/status.constants";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { AuthUsersEntity } from "~shared/core/infrastructure/entities/users/AuthUsers.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { AuthUsers, AuthUsersProps } from "~users/aggregates/authUsers/domain/AuthUsers";
import { PsqlKakaoMapper } from "~users/aggregates/authUsers/infrastructures/adaptors/mappers/psql.kakao.mapper";
import { PsqlRefreshTokensMapper } from "~users/aggregates/authUsers/infrastructures/adaptors/mappers/psql.refreshTokens.mapper";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlAuthUsersMapper {
  static toDomain(entity: AuthUsersEntity): AuthUsers | null {
    if (!entity) {
      return null;
    }

    const authUsersProps: AuthUsersProps = {
      status: CoreStatus.ACTIVE,
      userId: new UniqueEntityId(entity.userId),
      lastLoginAt: convertUtcStringToDayjs(entity.lastLoginAt),
      authChannel: entity.authChannel,
      kakao: PsqlKakaoMapper.toDomain(entity.kakao),
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
      refreshTokens: PsqlRefreshTokensMapper.toVOs(entity.refreshTokens),
    };
    const authUserOrError: Result<AuthUsers> = AuthUsers.create(authUsersProps, new UniqueEntityId(entity.id));
    if (authUserOrError.isFailure) {
      throw new InternalServerErrorException(authUserOrError.errorValue);
    }
    return authUserOrError.value;
  }

  static toEntity(authUser: AuthUsers): AuthUsersEntity {
    const entity = new AuthUsersEntity();

    entity.id = authUser.id.getString();
    entity.userId = authUser.userId?.getString() || null;
    entity.lastLoginAt = formatDayjsToUtcString(authUser.lastLoginAt);
    entity.authChannel = authUser.authChannel;
    entity.kakao = authUser.kakao ? PsqlKakaoMapper.toEntity(authUser.kakao) : null;
    entity.refreshTokens = PsqlRefreshTokensMapper.toEntities(authUser.refreshTokens, authUser.id);
    entity.createdAt = formatDayjsToUtcString(authUser.createdAt);
    entity.updatedAt = formatDayjsToUtcString(authUser.updatedAt);
    entity.deletedAt = authUser.deletedAt ? formatDayjsToUtcString(authUser.deletedAt) : null;
    return entity;
  }
}
