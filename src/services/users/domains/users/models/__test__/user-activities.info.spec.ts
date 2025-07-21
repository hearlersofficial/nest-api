import { UserActivitiesInfo } from "~users/domains/users/models/user-activities.info";
import { UserActivities } from "~users/domains/users/models/user-activities";
import { ActivityType, DevicePlatform } from "~proto/com/hearlers/v1/model/user_pb";

import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

describe("UserActivitiesInfo", () => {
  const createUserActivity = () => {
    const props = {
      userId: new UniqueEntityId(),
      activityType: ActivityType.LOGIN,
      activityData: { reason: "daily login" },
      platform: DevicePlatform.IOS,
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
      durationSeconds: 300,
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
    return UserActivities.create(props, new UniqueEntityId()).value as UserActivities;
  };

  describe("fromDomain", () => {
    it("UserActivities 도메인 객체로부터 UserActivitiesInfo를 생성할 수 있다", () => {
      const activity = createUserActivity();
      const activityInfo = UserActivitiesInfo.fromDomain(activity);

      expect(activityInfo.id).toBe(activity.id.getString());
      expect(activityInfo.userId).toBe(activity.userId.getString());
      expect(activityInfo.activityType).toBe(activity.activityType);
      expect(activityInfo.platform).toBe(activity.platform);
    });
  });

  describe("fromDomainArray", () => {
    it("UserActivities 도메인 객체 배열로부터 UserActivitiesInfo 배열을 생성할 수 있다", () => {
      const activities = [createUserActivity(), createUserActivity()];
      const activityInfos = UserActivitiesInfo.fromDomainArray(activities);

      expect(activityInfos).toHaveLength(2);
      expect(activityInfos[0].id).toBe(activities[0].id.getString());
      expect(activityInfos[1].id).toBe(activities[1].id.getString());
    });
  });
});
