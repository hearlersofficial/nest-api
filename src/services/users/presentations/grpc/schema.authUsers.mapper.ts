import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
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
      authority: authUser.authority,
      lastLoginAt: authUser.lastLoginAt.toISOString(),
      refreshTokens: this.toRefreshTokenProtos(authUser.refreshTokens),
      createdAt: authUser.createdAt.toISOString(),
      updatedAt: authUser.updatedAt.toISOString(),
      deletedAt: authUser.deletedAt ? authUser.deletedAt.toISOString() : null,
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
          createdAt: authUser.kakao.createdAt.toISOString(),
          updatedAt: authUser.kakao.updatedAt.toISOString(),
          deletedAt: authUser.kakao.deletedAt ? authUser.kakao.deletedAt.toISOString() : null,
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
      expiresAt: refreshToken.expiresAt.toISOString(),
      createdAt: refreshToken.createdAt.toISOString(),
      updatedAt: refreshToken.updatedAt.toISOString(),
    });
  }

  static toRefreshTokenProtos(refreshTokens: RefreshTokensVO[]): RefreshToken[] {
    if (!refreshTokens) return [];
    return refreshTokens.map(this.toRefreshTokenProto);
  }
}
