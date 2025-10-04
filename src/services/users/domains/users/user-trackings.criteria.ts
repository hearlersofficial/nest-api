import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserTrackingId } from "~common/shared-kernel/identifiers/user-tracking.id";

export type UniqueKey = { type: "user"; id: UserId };

export type FindOneOptions = {
  id: UserTrackingId;
  userId?: UserId;
};
