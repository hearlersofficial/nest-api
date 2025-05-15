import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { BubblesNewProps } from "~counselings/domains/counselors/models/bubbles";

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
