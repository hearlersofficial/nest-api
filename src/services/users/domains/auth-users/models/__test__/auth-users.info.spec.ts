import { AuthUsersInfo } from "~users/domains/auth-users/models/auth-users.info";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { Kakao } from "~users/domains/auth-users/models/kakao";
import { RefreshTokens } from "~users/domains/auth-users/models/refresh-tokens";
import { AuthChannel, Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { faker } from "@faker-js/faker";
import { CoreStatus } from "~common/shared/enums/status";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

describe("AuthUsersInfo", () => {
  const createAuthUser = () => {
    const authUserId = new UniqueEntityId();
    const kakao = Kakao.createNew({ authUserId, uniqueId: faker.string.numeric(10) }).value as Kakao;
    const refreshToken = RefreshTokens.createNew({
      token: faker.string.alphanumeric(32),
      expiresAt: getNowDayjs().add(7, "day"),
    }).value as RefreshTokens;

    const props = {
      authChannel: AuthChannel.KAKAO,
      status: CoreStatus.ACTIVE,
      authority: Authority.USER,
      userId: new UniqueEntityId(),
      lastLoginAt: getNowDayjs(),
      kakao,
      refreshTokens: [refreshToken],
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
    return AuthUsers.create(props, authUserId).value as AuthUsers;
  };

  describe("fromDomain", () => {
    it("AuthUsers 도메인 객체로부터 AuthUsersInfo를 생성할 수 있다", () => {
      const authUser = createAuthUser();
      const authUserInfo = AuthUsersInfo.fromDomain(authUser);

      expect(authUserInfo.id).toBe(authUser.id.getString());
      expect(authUserInfo.userId).toBe(authUser.userId?.getString());
      expect(authUserInfo.authChannel).toBe(authUser.authChannel);
      expect(authUserInfo.status).toBe(authUser.status);
      expect(authUserInfo.kakao?.id).toBe(authUser.kakao?.id.getString());
      expect(authUserInfo.refreshTokens).toHaveLength(1);
      expect(authUserInfo.refreshTokens[0].id).toBe(authUser.refreshTokens[0].id.getString());
    });
  });

  describe("fromDomainArray", () => {
    it("AuthUsers 도메인 객체 배열로부터 AuthUsersInfo 배열을 생성할 수 있다", () => {
      const authUsers = [createAuthUser(), createAuthUser()];
      const authUserInfos = AuthUsersInfo.fromDomainArray(authUsers);

      expect(authUserInfos).toHaveLength(2);
      expect(authUserInfos[0].id).toBe(authUsers[0].id.getString());
      expect(authUserInfos[1].id).toBe(authUsers[1].id.getString());
    });
  });
});
