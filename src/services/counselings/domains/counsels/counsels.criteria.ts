import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

export type CounselsCriteriaFindMany = {
  userId: UserId;
  counselorId?: CounselorId;
  orderBy?: {
    id: "ASC" | "DESC";
  };
};
