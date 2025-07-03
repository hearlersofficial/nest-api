import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

export type TechniqueResetCheckParams = {
  lastMessageTime: Dayjs;
  timeDurationForReset: number;
};

export type TechniqueChangeCheckParams = {
  messages: CounselMessageInfo[];
  currentTechniqueId: string;
  messageThreshold: number;
};

export type TechniqueUpdateParams = {
  counselId: UniqueEntityId;
  newTechniqueId: UniqueEntityId;
};

export type TechniqueManagementResult = {
  shouldReset: boolean;
  shouldChange: boolean;
  nextTechniqueId?: UniqueEntityId;
};
