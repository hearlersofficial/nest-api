import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { Dayjs } from "dayjs";

export type PromptActivateHistoryCriteriaFindMany = {
  promptVersionId?: PromptVersionId;
  activatedAtBefore?: Dayjs;
  orderBy?: {
    id: "ASC" | "DESC";
  };
};
