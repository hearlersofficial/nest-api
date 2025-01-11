import { fakerKO as faker } from "@faker-js/faker";
import { UserMessageTokens } from "./UserMessageTokens";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { TokenResetInterval } from "~/src/shared/enums/TokenResetInterval.enum";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";

describe("UserMessageTokens", () => {
  let defaultNewProps: any;
  let defaultProps: any;
  let userId: UniqueEntityId;

  beforeEach(() => {
    userId = new UniqueEntityId(faker.number.int());
    const now = getNowDayjs();

    defaultNewProps = {
      userId,
      resetInterval: TokenResetInterval.DAILY,
      maxTokens: 1000,
      remainingTokens: 1000,
    };

    defaultProps = {
      ...defaultNewProps,
      lastReset: now,
      reserved: false,
      reservedTimeout: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
  });

  describe("createNew", () => {
    it("새로운 UserMessageTokens를 생성할 수 있다", () => {
      const result = UserMessageTokens.createNew(defaultNewProps);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const tokens = result.value;
        expect(tokens.userId.equals(userId)).toBe(true);
        expect(tokens.maxTokens).toBe(1000);
        expect(tokens.remainingTokens).toBe(1000);
        expect(tokens.resetInterval).toBe(TokenResetInterval.DAILY);
        expect(tokens.isNew()).toBe(true);
      }
    });
  });

  describe("create", () => {
    it("기존 데이터로 UserMessageTokens를 생성할 수 있다", () => {
      const result = UserMessageTokens.create(defaultProps, new UniqueEntityId(1));

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const tokens = result.value;
        expect(tokens.userId.equals(userId)).toBe(true);
        expect(tokens.maxTokens).toBe(1000);
        expect(tokens.remainingTokens).toBe(1000);
      }
    });
  });

  describe("토큰 관리", () => {
    let tokens: UserMessageTokens;

    beforeEach(() => {
      tokens = UserMessageTokens.createNew(defaultNewProps).value as UserMessageTokens;
    });

    describe("consumeTokens", () => {
      it("토큰을 소비할 수 있다", () => {
        const result = tokens.consumeTokens(500);

        expect(result.isSuccess).toBe(true);
        expect(tokens.remainingTokens).toBe(500);
      });

      it("잔여 토큰보다 많은 양을 소비하려고 하면 실패한다", () => {
        const result = tokens.consumeTokens(1500);

        expect(result.isFailure).toBe(true);
        expect(result.error).toContain("[UserMessageTokens] 토큰이 부족합니다");
        expect(tokens.remainingTokens).toBe(1000);
      });
    });

    describe("resetTokens", () => {
      it("토큰을 리셋할 수 있다", () => {
        tokens.consumeTokens(500);
        const result = tokens.resetTokens();

        expect(result.isSuccess).toBe(true);
        expect(tokens.remainingTokens).toBe(tokens.maxTokens);
        expect(tokens.lastReset.isSame(getNowDayjs(), "minute")).toBe(true);
      });
    });

    describe("토큰 예약 관리", () => {
      it("토큰을 예약할 수 있다", () => {
        const result = tokens.reserveTokens();

        expect(result.isSuccess).toBe(true);
        expect(tokens.reserved).toBe(true);
        expect(tokens.reservedTimeout).toBeDefined();
      });

      it("예약된 토큰을 해제할 수 있다", () => {
        tokens.reserveTokens();
        const result = tokens.releaseTokens();

        expect(result.isSuccess).toBe(true);
        expect(tokens.reserved).toBe(false);
        expect(tokens.reservedTimeout).toBeNull();
      });

      it("예약 시간이 지나면 자동으로 예약이 해제된다", () => {
        tokens.reserveTokens();
        const expiredTokens = UserMessageTokens.create(
          {
            ...defaultProps,
            reserved: true,
            reservedTimeout: getNowDayjs().subtract(2, "minutes"),
          },
          new UniqueEntityId(),
        ).value as UserMessageTokens;

        expect(expiredTokens.isReserved()).toBe(false);
        expect(expiredTokens.reserved).toBe(false);
        expect(expiredTokens.reservedTimeout).toBeNull();
      });
    });

    describe("isResetTime", () => {
      it("일간 리셋 시간을 확인할 수 있다", () => {
        const sameDay = UserMessageTokens.create(
          {
            ...defaultProps,
            resetInterval: TokenResetInterval.DAILY,
            lastReset: getNowDayjs(),
          },
          new UniqueEntityId(),
        ).value as UserMessageTokens;

        expect(sameDay.isResetTime()).toBe(true);

        const differentDay = UserMessageTokens.create(
          {
            ...defaultProps,
            resetInterval: TokenResetInterval.DAILY,
            lastReset: getNowDayjs().subtract(1, "day"),
          },
          new UniqueEntityId(),
        ).value as UserMessageTokens;

        expect(differentDay.isResetTime()).toBe(false);
      });

      it("시간별 리셋 시간을 확인할 수 있다", () => {
        const sameHour = UserMessageTokens.create(
          {
            ...defaultProps,
            resetInterval: TokenResetInterval.HOURLY,
            lastReset: getNowDayjs(),
          },
          new UniqueEntityId(),
        ).value as UserMessageTokens;

        expect(sameHour.isResetTime()).toBe(true);

        const differentHour = UserMessageTokens.create(
          {
            ...defaultProps,
            resetInterval: TokenResetInterval.HOURLY,
            lastReset: getNowDayjs().subtract(1, "hour"),
          },
          new UniqueEntityId(),
        ).value as UserMessageTokens;

        expect(differentHour.isResetTime()).toBe(false);
      });
    });

    describe("updateMaxTokens", () => {
      it("최대 토큰 수를 업데이트할 수 있다", () => {
        const result = tokens.updateMaxTokens(2000);

        expect(result.isSuccess).toBe(true);
        expect(tokens.maxTokens).toBe(2000);
        expect(tokens.remainingTokens).toBe(2000);
      });
    });
  });
});
