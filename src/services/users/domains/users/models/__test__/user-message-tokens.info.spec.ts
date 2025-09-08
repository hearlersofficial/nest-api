import { UserMessageTokens } from "~users/domains/users/models/user-message-tokens";
import { UserMessageTokensInfo } from "~users/domains/users/models/user-message-tokens.info";

import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { getNowDayjs } from "~common/shared/utils/date";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserMessageTokenId } from "~common/shared-kernel/identifiers/user-message-token.id";

describe("UserMessageTokensInfo", () => {
  const createUserMessageTokens = () => {
    const props = {
      userId: new UserId(),
      resetInterval: TokenResetInterval.DAILY,
      maxTokens: 1000,
      remainingTokens: 500,
      lastReset: getNowDayjs(),
      reserved: false,
      reservedTimeout: null,
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
    return UserMessageTokens.create(props, new UserMessageTokenId()).value;
  };

  describe("fromDomain", () => {
    it("UserMessageTokens 도메인 객체로부터 UserMessageTokensInfo를 생성할 수 있다", () => {
      const tokens = createUserMessageTokens();
      const tokensInfo = UserMessageTokensInfo.fromDomain(tokens);

      expect(tokensInfo.id).toEqual(tokens.id);
      expect(tokensInfo.userId).toEqual(tokens.userId);
      expect(tokensInfo.maxTokens).toBe(tokens.maxTokens);
      expect(tokensInfo.remainingTokens).toBe(tokens.remainingTokens);
    });
  });

  describe("fromDomainArray", () => {
    it("UserMessageTokens 도메인 객체 배열로부터 UserMessageTokensInfo 배열을 생성할 수 있다", () => {
      const tokens = [createUserMessageTokens(), createUserMessageTokens()];
      const tokensInfos = UserMessageTokensInfo.fromDomainArray(tokens);

      expect(tokensInfos).toHaveLength(2);
      expect(tokensInfos[0].id).toEqual(tokens[0].id);
      expect(tokensInfos[1].id).toEqual(tokens[1].id);
    });
  });
});
