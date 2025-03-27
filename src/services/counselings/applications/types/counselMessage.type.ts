import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";

export type CreatedAndResponseMessages = {
  createdCounselMessage: CounselMessages;
  counselorResponseMessage: CounselMessages;
};
