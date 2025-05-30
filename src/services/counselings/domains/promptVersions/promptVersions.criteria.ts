import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export type PromptVersionsCriteriaFindMany = {
  name?: string;
  isActive?: boolean;
  isTemporary?: boolean;
  isBookmarked?: boolean;
  gptModel?: GPTModel;
  ids?: UniqueEntityId[];
};
