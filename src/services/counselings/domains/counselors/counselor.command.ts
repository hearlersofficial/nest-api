import { BubblesNewProps } from "~counselings/domains/counselors/models/bubbles";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export interface CreateBubbleCommand extends BubblesNewProps {
  counselorId: UniqueEntityId;
}

export interface UpdateBubbleCommand {
  counselorId: UniqueEntityId;
  bubbleId: UniqueEntityId;
  question?: string;
  responseOption1?: string;
  responseOption2?: string;
}
