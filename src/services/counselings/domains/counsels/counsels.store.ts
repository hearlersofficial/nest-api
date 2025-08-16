import {
  CompressedMessages,
  CompressedMessagesNewProps,
} from "~counselings/domains/counsels/models/compressed-messages";
import { CounselMessages, CounselMessagesNewProps } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels, CounselsNewProps } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselsStore {
  abstract create(newProps: CounselsNewProps): Promise<Counsels>;
  abstract update(counsel: Counsels): Promise<Counsels>;
  abstract updateMany(counsels: Counsels[]): Promise<Counsels[]>;
  abstract createMessage(newProps: CounselMessagesNewProps): Promise<CounselMessages>;
  abstract updateMessage(counselMessage: CounselMessages): Promise<CounselMessages>;
  abstract updateManyMessages(counselMessages: CounselMessages[]): Promise<CounselMessages[]>;
  abstract createCompressedMessage(newProps: CompressedMessagesNewProps): Promise<CompressedMessages>;
  abstract updateCompressedMessage(compressedMessage: CompressedMessages): Promise<CompressedMessages>;
  abstract updateManyCompressedMessages(compressedMessages: CompressedMessages[]): Promise<CompressedMessages[]>;
}
