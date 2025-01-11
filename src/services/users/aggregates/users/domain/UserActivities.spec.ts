import { ActivityType, DevicePlatform } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";

import { UserActivities } from "./UserActivities";

describe("UserActivities", () => {
  const createValidProps = () => ({
    userId: new UniqueEntityId(),
    activityType: ActivityType.LOGIN,
    activityData: { reason: "daily login" },
    platform: DevicePlatform.IOS,
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
    durationSeconds: 300,
  });

  describe("createNew", () => {
    it("유효한 속성으로 UserActivities를 생성할 수 있다", () => {
      const props = createValidProps();
      const result = UserActivities.createNew(props);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value.activityType).toBe(props.activityType);
      expect(result.value.platform).toBe(props.platform);
      expect(result.value.durationSeconds).toBe(props.durationSeconds);
    });

    it("필수 속성이 누락되면 실패한다", () => {
      const props = createValidProps();
      delete (props as any).activityType;

      const result = UserActivities.createNew(props);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("활동 유형은 필수입니다");
    });

    it("유효하지 않은 활동 유형으로 생성하면 실패한다", () => {
      const props = {
        ...createValidProps(),
        activityType: 999 as ActivityType,
      };

      const result = UserActivities.createNew(props);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("유효하지 않은 활동 유형입니다");
    });

    it("음수의 지속 시간으로 생성하면 실패한다", () => {
      const props = {
        ...createValidProps(),
        durationSeconds: -1,
      };

      const result = UserActivities.createNew(props);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("지속 시간은 0 이상이어야 합니다");
    });
  });

  describe("updateActivity", () => {
    it("활동 데이터를 업데이트할 수 있다", () => {
      const activity = UserActivities.createNew(createValidProps()).value;
      const newActivityData = { reason: "updated reason" };

      const result = activity.updateActivity({ activityData: newActivityData });

      expect(result.isSuccess).toBe(true);
      expect(activity.activityData).toEqual(newActivityData);
    });

    it("지속 시간을 업데이트할 수 있다", () => {
      const activity = UserActivities.createNew(createValidProps()).value;
      const newDuration = 600;

      const result = activity.updateActivity({ durationSeconds: newDuration });

      expect(result.isSuccess).toBe(true);
      expect(activity.durationSeconds).toBe(newDuration);
    });

    it("음수의 지속 시간으로 업데이트하면 실패한다", () => {
      const activity = UserActivities.createNew(createValidProps()).value;

      const result = activity.updateActivity({ durationSeconds: -1 });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("지속 시간은 0 이상이어야 합니다");
    });
  });

  describe("delete and restore", () => {
    it("활동을 삭제하고 복구할 수 있다", () => {
      const activity = UserActivities.createNew(createValidProps()).value;

      expect(activity.deletedAt).toBeNull();

      activity.delete();
      expect(activity.deletedAt).toBeDefined();
      expect(activity.deletedAt?.isSame(getNowDayjs(), "minute")).toBe(true);

      activity.restore();
      expect(activity.deletedAt).toBeNull();
    });
  });

  describe("getters", () => {
    it("모든 속성에 접근할 수 있다", () => {
      const props = createValidProps();
      const activity = UserActivities.createNew(props).value;

      expect(activity.userId).toEqual(props.userId);
      expect(activity.activityType).toBe(props.activityType);
      expect(activity.activityData).toEqual(props.activityData);
      expect(activity.platform).toBe(props.platform);
      expect(activity.ipAddress).toBe(props.ipAddress);
      expect(activity.userAgent).toBe(props.userAgent);
      expect(activity.durationSeconds).toBe(props.durationSeconds);
      expect(activity.createdAt).toBeDefined();
      expect(activity.updatedAt).toBeDefined();
      expect(activity.deletedAt).toBeNull();
    });
  });
});
