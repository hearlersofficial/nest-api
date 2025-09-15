import {
  CompressedMessages,
  CompressedMessagesNewProps,
} from "~counselings/domains/counsels/models/compressed-messages";
import {
  CounselCompressConditions,
  CounselCompressConditionsNewProps,
} from "~counselings/domains/counsels/models/counsel-compress-conditions";
import { CounselContexts, CounselContextsNewProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { CounselMessages, CounselMessagesNewProps } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels, CounselsNewProps } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselsStore {
  // Counsels 관련
  abstract create(newProps: CounselsNewProps): Promise<Counsels>;
  abstract update(counsel: Counsels): Promise<Counsels>;
  abstract updateMany(counsels: Counsels[]): Promise<Counsels[]>;

  // CounselMessages 관련
  abstract createMessage(newProps: CounselMessagesNewProps): Promise<CounselMessages>;
  abstract updateMessage(counselMessage: CounselMessages): Promise<CounselMessages>;
  abstract updateManyMessages(counselMessages: CounselMessages[]): Promise<CounselMessages[]>;

  // CompressedMessages 관련
  abstract createCompressedMessage(newProps: CompressedMessagesNewProps): Promise<CompressedMessages>;
  abstract updateCompressedMessage(compressedMessage: CompressedMessages): Promise<CompressedMessages>;
  abstract updateManyCompressedMessages(compressedMessages: CompressedMessages[]): Promise<CompressedMessages[]>;

  // CounselCompressConditions 관련
  abstract createCompressConditions(newProps: CounselCompressConditionsNewProps): Promise<CounselCompressConditions>;
  abstract updateCompressConditions(compressConditions: CounselCompressConditions): Promise<CounselCompressConditions>;

  // CounselContexts 관련
  abstract createContexts(newProps: CounselContextsNewProps): Promise<CounselContexts>;
  abstract updateContexts(contexts: CounselContexts): Promise<CounselContexts>;
}
