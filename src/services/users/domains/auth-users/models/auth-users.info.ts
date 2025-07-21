import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { KakaoInfo } from "~users/domains/auth-users/models/kakao.info";
import { RefreshTokensInfo } from "~users/domains/auth-users/models/refresh-tokens.info";
import { AuthChannel, Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { CoreStatus } from "~common/shared/enums/status";
import { Dayjs } from "dayjs";

export class AuthUsersInfo {
  constructor(
    public readonly id: string,
    public readonly authChannel: AuthChannel,
    public readonly status: CoreStatus,
    public readonly authority: Authority,
    public readonly userId: string | null,
    public readonly lastLoginAt: Dayjs,
    public readonly kakao: KakaoInfo | null,
    public readonly refreshTokens: RefreshTokensInfo[],
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(authUsers: AuthUsers): AuthUsersInfo {
    return new AuthUsersInfo(
      authUsers.id.getString(),
      authUsers.authChannel,
      authUsers.status,
      authUsers.authority,
      authUsers.userId ? authUsers.userId.getString() : null,
      authUsers.lastLoginAt,
      authUsers.kakao ? KakaoInfo.fromDomain(authUsers.kakao) : null,
      authUsers.refreshTokens ? RefreshTokensInfo.fromDomainArray(authUsers.refreshTokens) : [],
      authUsers.createdAt,
      authUsers.updatedAt,
      authUsers.deletedAt,
    );
  }

  static fromDomainArray(authUsers: AuthUsers[]): AuthUsersInfo[] {
    return authUsers.map((user) => AuthUsersInfo.fromDomain(user));
  }
}
