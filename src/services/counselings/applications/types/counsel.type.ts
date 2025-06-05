import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";

export type CounselWithMessages = {
  counsel: CounselInfo;
  counselMessages: CounselMessageInfo[];
};
