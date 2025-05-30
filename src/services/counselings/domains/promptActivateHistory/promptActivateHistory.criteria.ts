import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { Dayjs } from "dayjs";

export type PromptActivateHistoryCriteriaFindMany = {
  promptVersionId?: UniqueEntityId;
  activatedAtBefore?: Dayjs;
};
