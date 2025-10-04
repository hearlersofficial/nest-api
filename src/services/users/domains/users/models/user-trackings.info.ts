import { UserTrackings } from "~users/domains/users/models/user-trackings";

import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserTrackingId } from "~common/shared-kernel/identifiers/user-tracking.id";
import { Dayjs } from "dayjs";

export class UserTrackingsInfo {
  constructor(
    public readonly id: UserTrackingId,
    public readonly userId: UserId,
    public readonly hasSeenIntroCutscene: boolean,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(userTracking: UserTrackings): UserTrackingsInfo {
    return new UserTrackingsInfo(
      userTracking.id,
      userTracking.userId,
      userTracking.hasSeenIntroCutscene,
      userTracking.createdAt,
      userTracking.updatedAt,
      userTracking.deletedAt,
    );
  }

  static fromDomainArray(userTrackings: UserTrackings[]): UserTrackingsInfo[] {
    return userTrackings.map((tracking) => UserTrackingsInfo.fromDomain(tracking));
  }
}
