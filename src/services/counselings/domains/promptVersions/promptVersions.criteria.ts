import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export type PromptVersionsCriteriaFindMany = {
  name?: string;
  isActive?: boolean;
  isTemporary?: boolean;
  isBookmarked?: boolean;
  ids?: UniqueEntityId[];
};
