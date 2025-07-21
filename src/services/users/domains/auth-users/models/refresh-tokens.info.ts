import { RefreshTokens } from "~users/domains/auth-users/models/refresh-tokens";

import { Dayjs } from "dayjs";

export class RefreshTokensInfo {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly expiresAt: Dayjs,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
  ) {}

  static fromDomain(refreshToken: RefreshTokens): RefreshTokensInfo {
    return new RefreshTokensInfo(
      refreshToken.id.getString(),
      refreshToken.token,
      refreshToken.expiresAt,
      refreshToken.createdAt,
      refreshToken.updatedAt,
    );
  }

  static fromDomainArray(refreshTokens: RefreshTokens[]): RefreshTokensInfo[] {
    return refreshTokens.map((token) => RefreshTokensInfo.fromDomain(token));
  }
}
