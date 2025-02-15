import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { RefreshTokensVO } from "~users/aggregates/authUsers/domain/RefreshTokens.vo";
import {
  AuthChannel,
  AuthUser,
  AuthUserSchema,
  OAuthChannelInfo,
  OAuthChannelInfoSchema,
  RefreshToken,
  RefreshTokenSchema,
} from "~proto/com/hearlers/v1/model/auth_user_pb";

import { create } from "@bufbuild/protobuf";
import { HttpStatus } from "@nestjs/common";

export class SchemaAuthUsersMapper {
  static toAuthUserProto(authUser: AuthUsers): AuthUser {
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to map authUser to proto");
    }
    return create(AuthUserSchema, {
      id: authUser.id.getString(),
      userId: authUser.userId.getString(),
      authChannel: authUser.authChannel,
      oauthChannelInfo: this.toOAuthChannelInfoProto(authUser),
      lastLoginAt: formatDayjsToUtcString(authUser.lastLoginAt),
      refreshTokens: this.toRefreshTokenProtos(authUser.refreshTokens),
      createdAt: formatDayjsToUtcString(authUser.createdAt),
      updatedAt: formatDayjsToUtcString(authUser.updatedAt),
      deletedAt: authUser.deletedAt ? formatDayjsToUtcString(authUser.deletedAt) : null,
    });
  }

  static toOAuthChannelInfoProto(authUser: AuthUsers): OAuthChannelInfo {
    if (!authUser) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "failed to map oauthChannelInfo to proto",
      );
    }
    switch (authUser.authChannel) {
      case AuthChannel.KAKAO:
        return create(OAuthChannelInfoSchema, {
          id: authUser.kakao.id.getString(),
          authChannel: authUser.authChannel,
          uniqueId: authUser.kakao.uniqueId,
          createdAt: formatDayjsToUtcString(authUser.kakao.createdAt),
          updatedAt: formatDayjsToUtcString(authUser.kakao.updatedAt),
          deletedAt: authUser.kakao.deletedAt ? formatDayjsToUtcString(authUser.kakao.deletedAt) : null,
        });
      default:
        return null;
    }
  }
  static toRefreshTokenProto(refreshToken: RefreshTokensVO): RefreshToken {
    if (!refreshToken) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to map refreshToken to proto");
    }
    return create(RefreshTokenSchema, {
      token: refreshToken.token,
      expiresAt: formatDayjsToUtcString(refreshToken.expiresAt),
      createdAt: formatDayjsToUtcString(refreshToken.createdAt),
      updatedAt: formatDayjsToUtcString(refreshToken.updatedAt),
    });
  }

  static toRefreshTokenProtos(refreshTokens: RefreshTokensVO[]): RefreshToken[] {
    if (!refreshTokens) return [];
    return refreshTokens.map(this.toRefreshTokenProto);
  }
}
