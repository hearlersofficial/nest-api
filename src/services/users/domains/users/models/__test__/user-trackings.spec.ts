import { UserTrackings } from "~users/domains/users/models/user-trackings";

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UserTrackingId } from "~common/shared-kernel/identifiers/user-tracking.id";

describe("UserTrackings", () => {
  let defaultNewProps: any;
  let defaultProps: any;
  let userId: UniqueEntityId;

  beforeEach(() => {
    userId = new UniqueEntityId(faker.number.int());

    defaultNewProps = {
      userId,
      hasSeenIntroCutscene: false,
    };

    defaultProps = {
      ...defaultNewProps,
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
  });

  describe("createNew", () => {
    it("새로운 UserTracking을 생성할 수 있다", () => {
      const result = UserTrackings.createNew(defaultNewProps);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const tracking = result.value;
        expect(tracking.userId.equals(userId)).toBe(true);
        expect(tracking.hasSeenIntroCutscene).toBe(false);
      }
    });

    it("필수 값이 없으면 생성에 실패한다", () => {
      const result = UserTrackings.createNew({
        ...defaultNewProps,
        userId: undefined,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserTrackings] 사용자 ID는 필수입니다");
    });

    it("hasSeenIntroCutscene이 null이면 생성에 실패한다", () => {
      const result = UserTrackings.createNew({
        ...defaultNewProps,
        hasSeenIntroCutscene: null,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserTrackings] 인트로 컷씬 시청 여부는 필수입니다");
    });

    it("hasSeenIntroCutscene이 undefined이면 생성에 실패한다", () => {
      const result = UserTrackings.createNew({
        ...defaultNewProps,
        hasSeenIntroCutscene: undefined,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserTrackings] 인트로 컷씬 시청 여부는 필수입니다");
    });
  });

  describe("create", () => {
    it("기존 데이터로 UserTracking을 생성할 수 있다", () => {
      const result = UserTrackings.create(defaultProps, new UserTrackingId(1));

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const tracking = result.value;
        expect(tracking.userId.equals(userId)).toBe(true);
        expect(tracking.hasSeenIntroCutscene).toBe(false);
      }
    });
  });

  describe("updateIntroCutsceneStatus", () => {
    let tracking: UserTrackings;

    beforeEach(() => {
      tracking = UserTrackings.createNew(defaultNewProps).value as UserTrackings;
    });

    it("인트로 컷씬 시청 상태를 업데이트할 수 있다", () => {
      const result = tracking.updateIntroCutsceneStatus(true);

      expect(result.isSuccess).toBe(true);
      expect(tracking.hasSeenIntroCutscene).toBe(true);
    });

    it("인트로 컷씬 시청 상태를 false로 업데이트할 수 있다", () => {
      const trackingWithTrue = UserTrackings.createNew({
        ...defaultNewProps,
        hasSeenIntroCutscene: true,
      }).value as UserTrackings;

      const result = trackingWithTrue.updateIntroCutsceneStatus(false);

      expect(result.isSuccess).toBe(true);
      expect(trackingWithTrue.hasSeenIntroCutscene).toBe(false);
    });
  });

  describe("delete/restore", () => {
    it("삭제하고 복구할 수 있다", () => {
      const tracking = UserTrackings.createNew(defaultNewProps).value as UserTrackings;

      expect(tracking.deletedAt).toBeNull();

      tracking.delete();
      expect(tracking.deletedAt).not.toBeNull();

      tracking.restore();
      expect(tracking.deletedAt).toBeNull();
    });
  });

  describe("validateDomain", () => {
    it("유효하지 않은 userId면 실패한다", () => {
      const result = UserTrackings.create(
        {
          ...defaultProps,
          userId: null,
        },
        new UserTrackingId(1),
      );

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserTrackings] 사용자 ID는 필수입니다");
    });

    it("hasSeenIntroCutscene이 유효하지 않으면 실패한다", () => {
      const result = UserTrackings.create(
        {
          ...defaultProps,
          hasSeenIntroCutscene: "invalid" as any,
        },
        new UserTrackingId(1),
      );

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserTrackings] 인트로 컷씬 시청 여부는 필수입니다");
    });
  });
});
