import { ProgressStatus, ProgressType } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";

import { UserProgresses } from "./UserProgresses";
import { fakerKO as faker } from "@faker-js/faker";

describe("UserProgresses", () => {
  describe("createNew", () => {
    it("새로운 UserProgress를 생성할 수 있다", () => {
      const userId = new UniqueEntityId(faker.number.int());
      const result = UserProgresses.createNew({
        userId,
        progressType: ProgressType.ONBOARDING,
        status: ProgressStatus.NOT_STARTED,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const progress = result.value;
        expect(progress.userId.equals(userId)).toBe(true);
        expect(progress.progressType).toBe(ProgressType.ONBOARDING);
        expect(progress.status).toBe(ProgressStatus.NOT_STARTED);
        expect(progress.isNew()).toBe(true);
      }
    });

    it("필수 값이 없으면 생성에 실패한다", () => {
      const result = UserProgresses.createNew({
        userId: undefined as any,
        progressType: ProgressType.ONBOARDING,
        status: undefined as any,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserProgresses] 사용자 ID는 필수입니다");
    });
  });

  describe("create", () => {
    it("기존 데이터로 UserProgress를 생성할 수 있다", () => {
      const now = getNowDayjs();
      const props = {
        userId: new UniqueEntityId(faker.number.int()),
        progressType: ProgressType.ONBOARDING,
        status: ProgressStatus.IN_PROGRESS,
        lastUpdated: now,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };

      const result = UserProgresses.create(props, new UniqueEntityId(1));

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const progress = result.value;
        expect(progress.userId.equals(props.userId)).toBe(true);
        expect(progress.progressType).toBe(props.progressType);
        expect(progress.status).toBe(props.status);
      }
    });
  });

  describe("updateStatus", () => {
    it("상태를 업데이트할 수 있다", async () => {
      const progress = UserProgresses.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        progressType: ProgressType.ONBOARDING,
        status: ProgressStatus.NOT_STARTED,
      }).value;

      const beforeUpdate = progress.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 10));
      progress.updateStatus(ProgressStatus.IN_PROGRESS);

      expect(progress.status).toBe(ProgressStatus.IN_PROGRESS);
      expect(progress.updatedAt.isAfter(beforeUpdate)).toBe(true);
      expect(progress.lastUpdated.isAfter(beforeUpdate)).toBe(true);
    });
  });

  describe("delete/restore", () => {
    it("삭제하고 복구할 수 있다", () => {
      const progress = UserProgresses.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        progressType: ProgressType.ONBOARDING,
        status: ProgressStatus.NOT_STARTED,
      }).value;

      expect(progress.deletedAt).toBeNull();

      progress.delete();
      expect(progress.deletedAt).not.toBeNull();

      progress.restore();
      expect(progress.deletedAt).toBeNull();
    });
  });

  describe("validateDomain", () => {
    it("유효하지 않은 progressType이면 실패한다", () => {
      const result = UserProgresses.create(
        {
          userId: new UniqueEntityId(faker.number.int()),
          progressType: "INVALID_TYPE" as unknown as ProgressType,
          status: ProgressStatus.NOT_STARTED,
          lastUpdated: getNowDayjs(),
          createdAt: getNowDayjs(),
          updatedAt: getNowDayjs(),
          deletedAt: null,
        },
        new UniqueEntityId(1),
      );

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserProgresses] 유효하지 않은 진행 유형입니다");
    });

    it("유효하지 않은 status면 실패한다", () => {
      const result = UserProgresses.create(
        {
          userId: new UniqueEntityId(faker.number.int()),
          progressType: ProgressType.ONBOARDING,
          status: "INVALID_STATUS" as unknown as ProgressStatus,
          lastUpdated: getNowDayjs(),
          createdAt: getNowDayjs(),
          updatedAt: getNowDayjs(),
          deletedAt: null,
        },
        new UniqueEntityId(1),
      );

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserProgresses] 유효하지 않은 상태입니다");
    });
  });
});
