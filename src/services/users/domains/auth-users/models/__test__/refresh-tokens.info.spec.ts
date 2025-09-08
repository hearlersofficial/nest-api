import { RefreshTokenInfo } from "~users/domains/auth-users/models/refresh-token.info";
import { RefreshTokens } from "~users/domains/auth-users/models/refresh-tokens";

import { faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { RefreshTokenId } from "~common/shared-kernel/identifiers/refresh-token.id";

describe("RefreshTokensInfo", () => {
  const createRefreshToken = () => {
    const props = {
      token: faker.string.alphanumeric(32),
      expiresAt: getNowDayjs().add(7, "day"),
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
    return RefreshTokens.create(props, new RefreshTokenId()).value as RefreshTokens;
  };

  describe("fromDomain", () => {
    it("RefreshTokens 도메인 객체로부터 RefreshTokensInfo를 생성할 수 있다", () => {
      const refreshToken = createRefreshToken();
      const refreshTokenInfo = RefreshTokenInfo.fromDomain(refreshToken);

      expect(refreshTokenInfo.id).toEqual(refreshToken.id);
      expect(refreshTokenInfo.token).toBe(refreshToken.token);
      expect(refreshTokenInfo.expiresAt).toEqual(refreshToken.expiresAt);
      expect(refreshTokenInfo.createdAt).toEqual(refreshToken.createdAt);
      expect(refreshTokenInfo.updatedAt).toEqual(refreshToken.updatedAt);
    });
  });

  describe("fromDomainArray", () => {
    it("RefreshTokens 도메인 객체 배열로부터 RefreshTokensInfo 배열을 생성할 수 있다", () => {
      const refreshTokens = [createRefreshToken(), createRefreshToken()];
      const refreshTokenInfos = RefreshTokenInfo.fromDomainArray(refreshTokens);

      expect(refreshTokenInfos).toHaveLength(2);
      expect(refreshTokenInfos[0].id).toEqual(refreshTokens[0].id);
      expect(refreshTokenInfos[1].id).toEqual(refreshTokens[1].id);
    });
  });
});
