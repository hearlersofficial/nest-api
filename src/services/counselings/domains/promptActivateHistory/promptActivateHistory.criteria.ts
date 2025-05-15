import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

import { Dayjs } from "dayjs";

export type PromptActivateHistoryCriteriaFindMany = {
  promptVersionId?: UniqueEntityId;
  activatedAtBefore?: Dayjs;
};
