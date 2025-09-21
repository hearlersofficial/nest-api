import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

export type UniqueKey =
  | { type: "counselorUserRelationship"; id: CounselorUserRelationshipId }
  | { type: "userAndCounselor"; userId: UserId; counselorId: CounselorId };

export type FindOneOptions = {
  counselorId?: CounselorId;
  userId?: UserId;
};

export type FindManyOptions = {
  userId?: UserId;
};
