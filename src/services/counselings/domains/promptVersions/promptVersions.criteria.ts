import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

export type PromptVersionsCriteriaFindMany = {
  name?: string;
  isActive?: boolean;
  isTemporary?: boolean;
  isBookmarked?: boolean;
  gptModel?: GPTModel;
  ids?: UniqueEntityId[];
};
