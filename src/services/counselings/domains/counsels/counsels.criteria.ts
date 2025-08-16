import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

export type CounselsCriteriaFindMany = {
  userId: UserId;
  counselorId?: CounselorId;
  orderBy?: {
    id: "ASC" | "DESC";
  };
};

export type CompressedMessagesCriteriaFindMany = {
  counselId: CounselId;
};

export type CounselMessagesCriteriaFindMany = {
  counselId: CounselId;
  limit?: number;
  offset?: number;
  orderBy?: {
    id: "ASC" | "DESC";
  };
};
