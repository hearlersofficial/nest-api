import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { FindManyBubblesCriteria } from "~counselings/domains/counselors/counselors.criteria";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";

export abstract class BubblesReader {
  abstract findBubbles(props: FindManyBubblesCriteria): Promise<Bubbles[]>;
  abstract findRandomBubble(counselorId: UniqueEntityId): Promise<Bubbles>;
  abstract findBubbleById(bubbleId: UniqueEntityId): Promise<Bubbles | null>;
}
