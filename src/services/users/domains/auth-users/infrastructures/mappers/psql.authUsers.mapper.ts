import { PsqlKakaoMapper } from "~users/domains/auth-users/infrastructures/mappers/psql.kakao.mapper";
import { PsqlRefreshTokensMapper } from "~users/domains/auth-users/infrastructures/mappers/psql-refresh-token.mapper";
import { AuthUsers, AuthUsersProps } from "~users/domains/auth-users/models/auth-users";

import { HttpStatus } from "@nestjs/common";
import { CoreStatus } from "~common/shared/enums/status";
import { Result } from "~common/shared-kernel/domains/results";
import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/auth-users.entity";
import dayjs from "dayjs";

export class PsqlAuthUsersMapper {
  static toDomain(entity: AuthUsersEntity): AuthUsers | null {
    if (!entity) {
      return null;
    }

    const authUsersProps: AuthUsersProps = {
      status: CoreStatus.ACTIVE,
      authority: entity.authority,
      userId: entity.userId ? new UserId(entity.userId) : null,
      lastLoginAt: dayjs(entity.lastLoginAt),
      authChannel: entity.authChannel,
      kakao: entity.kakao ? PsqlKakaoMapper.toDomain(entity.kakao) : null,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
      refreshTokens: entity.refreshTokens ? PsqlRefreshTokensMapper.toDomains(entity.refreshTokens) : [],
    };
    const authUserOrError: Result<AuthUsers> = AuthUsers.create(authUsersProps, new AuthUserId(entity.id));
    if (authUserOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, authUserOrError.errorValue);
    }
    return authUserOrError.value;
  }

  static toDomains(entities: AuthUsersEntity[]): AuthUsers[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter((authUser) => authUser !== null);
  }

  static toEntity(authUser: AuthUsers): AuthUsersEntity {
    const entity = new AuthUsersEntity();

    entity.id = authUser.id.getString();
    entity.userId = authUser.userId?.getString() || null;
    entity.authority = authUser.authority;
    entity.lastLoginAt = authUser.lastLoginAt.toISOString();
    entity.authChannel = authUser.authChannel;
    entity.kakao = authUser.kakao ? PsqlKakaoMapper.toEntity(authUser.kakao) : null;
    entity.refreshTokens = PsqlRefreshTokensMapper.toEntities(authUser.refreshTokens, authUser.id);
    entity.createdAt = authUser.createdAt.toISOString();
    entity.updatedAt = authUser.updatedAt.toISOString();
    entity.deletedAt = authUser.deletedAt ? authUser.deletedAt.toISOString() : null;
    return entity;
  }

  static toEntities(authUsers: AuthUsers[]): AuthUsersEntity[] {
    if (authUsers.length === 0) {
      return [];
    }
    return authUsers.map((authUser) => this.toEntity(authUser));
  }
}
