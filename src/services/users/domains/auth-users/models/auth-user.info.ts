import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { KakaoInfo } from "~users/domains/auth-users/models/kakao.info";
import { RefreshTokenInfo } from "~users/domains/auth-users/models/refresh-token.info";
import { AuthChannel, Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { CoreStatus } from "~common/shared/enums/status";
import { Dayjs } from "dayjs";

export class AuthUserInfo {
  constructor(
    public readonly id: string,
    public readonly authChannel: AuthChannel,
    public readonly status: CoreStatus,
    public readonly authority: Authority,
    public readonly userId: string | null,
    public readonly lastLoginAt: Dayjs,
    public readonly kakao: KakaoInfo | null,
    public readonly refreshTokens: RefreshTokenInfo[],
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(authUsers: AuthUsers): AuthUserInfo {
    return new AuthUserInfo(
      authUsers.id.getString(),
      authUsers.authChannel,
      authUsers.status,
      authUsers.authority,
      authUsers.userId ? authUsers.userId.getString() : null,
      authUsers.lastLoginAt,
      authUsers.kakao ? KakaoInfo.fromDomain(authUsers.kakao) : null,
      authUsers.refreshTokens ? RefreshTokenInfo.fromDomainArray(authUsers.refreshTokens) : [],
      authUsers.createdAt,
      authUsers.updatedAt,
      authUsers.deletedAt,
    );
  }

  static fromDomainArray(authUsers: AuthUsers[]): AuthUserInfo[] {
    return authUsers.map((user) => AuthUserInfo.fromDomain(user));
  }
}
