import { UserActivities } from "~users/domains/users/models/user-activities";
import { ActivityType, DevicePlatform } from "~proto/com/hearlers/v1/model/user_pb";

import { Dayjs } from "dayjs";

export class UserActivitiesInfo {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly activityType: ActivityType,
    public readonly activityData: Record<string, any>,
    public readonly platform: DevicePlatform,
    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly durationSeconds: number,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(activity: UserActivities): UserActivitiesInfo {
    return new UserActivitiesInfo(
      activity.id.getString(),
      activity.userId.getString(),
      activity.activityType,
      activity.activityData,
      activity.platform,
      activity.ipAddress,
      activity.userAgent,
      activity.durationSeconds,
      activity.createdAt,
      activity.updatedAt,
      activity.deletedAt,
    );
  }

  static fromDomainArray(activities: UserActivities[]): UserActivitiesInfo[] {
    return activities.map((activity) => UserActivitiesInfo.fromDomain(activity));
  }
}
