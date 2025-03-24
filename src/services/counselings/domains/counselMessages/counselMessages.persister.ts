import { CounselMessages, CounselMessagesNewProps } from "~counselings/domains/counselMessages/models/counselMessages";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselMessagesPersister {
  abstract create(newProps: CounselMessagesNewProps): Promise<CounselMessages>;
  abstract update(counselMessage: CounselMessages): Promise<CounselMessages>;
  abstract updateMany(counselMessages: CounselMessages[]): Promise<CounselMessages[]>;
}
