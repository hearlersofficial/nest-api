import { RefreshTokens } from "~users/domains/auth-users/models/refresh-tokens";

import { RefreshTokenId } from "~common/shared-kernel/identifiers/refresh-token.id";
import { Dayjs } from "dayjs";

export class RefreshTokenInfo {
  constructor(
    public readonly id: RefreshTokenId,
    public readonly token: string,
    public readonly expiresAt: Dayjs,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
  ) {}

  static fromDomain(refreshToken: RefreshTokens): RefreshTokenInfo {
    return new RefreshTokenInfo(
      refreshToken.id,
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
