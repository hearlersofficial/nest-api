import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";

export type CreatedAndResponseMessages = {
  createdCounselMessage: CounselMessageInfo;
  counselorResponseMessage: CounselMessageInfo;
};
