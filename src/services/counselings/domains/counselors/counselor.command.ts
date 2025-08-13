import { BubblesNewProps } from "~counselings/domains/counselors/models/bubbles";

import { BubbleId } from "~common/shared-kernel/identifiers/bubble.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";

export interface CreateBubbleCommand extends BubblesNewProps {
  counselorId: CounselorId;
}

export interface UpdateBubbleCommand {
  counselorId: CounselorId;
  bubbleId: BubbleId;
  question?: string;
  responseOption1?: string;
  responseOption2?: string;
}
