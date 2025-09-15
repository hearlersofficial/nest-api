import {
  CompressedMessagesCriteriaFindMany,
  CounselMessagesCriteriaFindMany,
  CounselsCriteriaFindMany,
} from "~counselings/domains/counsels/counsels.criteria";
import { CompressedMessages } from "~counselings/domains/counsels/models/compressed-messages";
import { CounselCompressConditions } from "~counselings/domains/counsels/models/counsel-compress-conditions";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { CompressedMessageId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";

@Injectable()
export abstract class CounselsReader {
  // Counsels 관련
  abstract findOne(props: { counselId: CounselId }): Promise<Counsels | null>;
  abstract findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]>;

  // CounselMessages 관련
  abstract findOneMessage(props: { counselMessageId: CounselMessageId }): Promise<CounselMessages | null>;
  abstract findManyMessages(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]>;

  // CompressedMessages 관련
  abstract findOneCompressedMessage(props: {
    compressedMessageId: CompressedMessageId;
  }): Promise<CompressedMessages | null>;
  abstract findManyCompressedMessages(props: CompressedMessagesCriteriaFindMany): Promise<CompressedMessages[]>;

  // CounselCompressConditions 관련
  abstract findCompressConditions(props: { counselId: CounselId }): Promise<CounselCompressConditions | null>;

  // CounselContexts 관련
  abstract findContexts(props: { counselId: CounselId }): Promise<CounselContexts | null>;
}
