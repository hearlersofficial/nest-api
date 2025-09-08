import { UserActivities } from "~users/domains/users/models/user-activities";
import { UserActivitiesInfo } from "~users/domains/users/models/user-activities.info";
import { ActivityType, DevicePlatform } from "~proto/com/hearlers/v1/model/user_pb";

import { getNowDayjs } from "~common/shared/utils/date";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserActivityId } from "~common/shared-kernel/identifiers/user-activity.id";

describe("UserActivitiesInfo", () => {
  const createUserActivity = () => {
    const props = {
      userId: new UserId(),
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
    return UserActivities.create(props, new UserActivityId()).value as UserActivities;
  };

  describe("fromDomain", () => {
    it("UserActivities 도메인 객체로부터 UserActivitiesInfo를 생성할 수 있다", () => {
      const activity = createUserActivity();
      const activityInfo = UserActivitiesInfo.fromDomain(activity);

      expect(activityInfo.id).toEqual(activity.id);
      expect(activityInfo.userId).toEqual(activity.userId);
      expect(activityInfo.activityType).toBe(activity.activityType);
      expect(activityInfo.platform).toBe(activity.platform);
    });
  });

  describe("fromDomainArray", () => {
    it("UserActivities 도메인 객체 배열로부터 UserActivitiesInfo 배열을 생성할 수 있다", () => {
      const activities = [createUserActivity(), createUserActivity()];
      const activityInfos = UserActivitiesInfo.fromDomainArray(activities);

      expect(activityInfos).toHaveLength(2);
      expect(activityInfos[0].id).toEqual(activities[0].id);
      expect(activityInfos[1].id).toEqual(activities[1].id);
    });
  });
});
