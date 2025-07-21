import { RefreshTokens } from "~users/domains/auth-users/models/refresh-tokens";

import { Dayjs } from "dayjs";

export class RefreshTokenInfo {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly expiresAt: Dayjs,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
  ) {}

  static fromDomain(refreshToken: RefreshTokens): RefreshTokenInfo {
    return new RefreshTokenInfo(
      refreshToken.id.getString(),
      refreshToken.token,
      refreshToken.expiresAt,
      refreshToken.createdAt,
      refreshToken.updatedAt,
    );
  }

  static fromDomainArray(refreshTokens: RefreshTokens[]): RefreshTokenInfo[] {
    return refreshTokens.map((token) => RefreshTokenInfo.fromDomain(token));
  }
}
