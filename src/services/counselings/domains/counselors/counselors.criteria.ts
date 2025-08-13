import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";

export type CounselorsCriteriaFindMany = {
  name?: string;
  toneId?: ToneId;
};

export type FindManyBubblesCriteria = {
  counselorId: CounselorId;
};
