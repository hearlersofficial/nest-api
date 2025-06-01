import { FindManyBubblesCriteria } from "~counselings/domains/counselors/counselors.criteria";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export abstract class BubblesReader {
  abstract findBubbles(props: FindManyBubblesCriteria): Promise<Bubbles[]>;
  abstract findRandomBubble(counselorId: UniqueEntityId): Promise<Bubbles>;
  abstract findBubbleById(bubbleId: UniqueEntityId): Promise<Bubbles | null>;
  abstract getBubbleById(bubbleId: UniqueEntityId): Promise<Bubbles>;
}
