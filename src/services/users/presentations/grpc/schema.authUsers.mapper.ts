import { create } from "@bufbuild/protobuf";
import { HttpStatus } from "@nestjs/common";
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
} from "~/src/gen/com/hearlers/v1/model/auth_user_pb";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { formatDayjs } from "~shared/utils/Date.utils";

export class SchemaAuthUsersMapper {
  static toAuthUserProto(authUser: AuthUsers): AuthUser {
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to map authUser to proto");
    }
    return create(AuthUserSchema, {
      id: authUser.id.getNumber(),
      userId: authUser.userId,
      authChannel: authUser.authChannel,
      oauthChannelInfo: this.toOAuthChannelInfoProto(authUser),
      lastLoginAt: formatDayjs(authUser.lastLoginAt),
      refreshTokens: this.toRefreshTokenProtos(authUser.refreshTokens),
      createdAt: formatDayjs(authUser.createdAt),
      updatedAt: formatDayjs(authUser.updatedAt),
      deletedAt: authUser.deletedAt ? formatDayjs(authUser.deletedAt) : null,
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
          id: authUser.kakao.id.getNumber(),
          authChannel: authUser.authChannel,
          uniqueId: authUser.kakao.uniqueId,
          createdAt: formatDayjs(authUser.kakao.createdAt),
          updatedAt: formatDayjs(authUser.kakao.updatedAt),
          deletedAt: authUser.kakao.deletedAt ? formatDayjs(authUser.kakao.deletedAt) : null,
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
      expiresAt: formatDayjs(refreshToken.expiresAt),
      createdAt: formatDayjs(refreshToken.createdAt),
      updatedAt: formatDayjs(refreshToken.updatedAt),
    });
  }

  static toRefreshTokenProtos(refreshTokens: RefreshTokensVO[]): RefreshToken[] {
    if (!refreshTokens) return [];
    return refreshTokens.map(this.toRefreshTokenProto);
  }
}
