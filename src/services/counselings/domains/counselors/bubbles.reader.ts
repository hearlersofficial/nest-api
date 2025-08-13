import { FindManyBubblesCriteria } from "~counselings/domains/counselors/counselors.criteria";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";

import { BubbleId } from "~common/shared-kernel/identifiers/bubble.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";

export abstract class BubblesReader {
  abstract findBubbles(props: FindManyBubblesCriteria): Promise<Bubbles[]>;
  abstract findRandomBubble(counselorId: CounselorId): Promise<Bubbles>;
  abstract findBubbleById(bubbleId: BubbleId): Promise<Bubbles | null>;
  abstract getBubbleById(bubbleId: BubbleId): Promise<Bubbles>;
}
