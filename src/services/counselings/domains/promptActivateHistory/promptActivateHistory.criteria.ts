import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

export type PromptActivateHistoryCriteriaFindMany = {
  promptVersionId?: UniqueEntityId;
  activatedAtBefore?: Dayjs;
  orderBy?: {
    id: "ASC" | "DESC";
  };
};
