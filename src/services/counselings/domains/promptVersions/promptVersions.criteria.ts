import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

export type PromptVersionsCriteriaFindMany = {
  name?: string;
  isActive?: boolean;
  isTemporary?: boolean;
  isBookmarked?: boolean;
  aiModel?: AiModel;
  ids?: PromptVersionId[];
  orderBy?: {
    id: "ASC" | "DESC";
  };
  withDeleted?: boolean;
};
