import { UserMessageTokens } from "~users/domains/users/models/user-message-tokens";
import { UserMessageTokensInfo } from "~users/domains/users/models/user-message-tokens.info";

import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

describe("UserMessageTokensInfo", () => {
  const createUserMessageTokens = () => {
    const props = {
      userId: new UniqueEntityId(),
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
    return UserMessageTokens.create(props, new UniqueEntityId()).value as UserMessageTokens;
  };

  describe("fromDomain", () => {
    it("UserMessageTokens 도메인 객체로부터 UserMessageTokensInfo를 생성할 수 있다", () => {
      const tokens = createUserMessageTokens();
      const tokensInfo = UserMessageTokensInfo.fromDomain(tokens);

      expect(tokensInfo.id).toBe(tokens.id.getString());
      expect(tokensInfo.userId).toBe(tokens.userId.getString());
      expect(tokensInfo.maxTokens).toBe(tokens.maxTokens);
      expect(tokensInfo.remainingTokens).toBe(tokens.remainingTokens);
    });
  });

  describe("fromDomainArray", () => {
    it("UserMessageTokens 도메인 객체 배열로부터 UserMessageTokensInfo 배열을 생성할 수 있다", () => {
      const tokens = [createUserMessageTokens(), createUserMessageTokens()];
      const tokensInfos = UserMessageTokensInfo.fromDomainArray(tokens);

      expect(tokensInfos).toHaveLength(2);
      expect(tokensInfos[0].id).toBe(tokens[0].id.getString());
      expect(tokensInfos[1].id).toBe(tokens[1].id.getString());
    });
  });
});
