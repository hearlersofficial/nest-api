import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

export type CounselWithMessages = {
  counsel: Counsels;
  counselMessages: CounselMessages[];
};
