import {
  CompressedMessagesCriteriaFindMany,
  CounselMessagesCriteriaFindMany,
  CounselsCriteriaFindMany,
} from "~counselings/domains/counsels/counsels.criteria";
import { CompressedMessages } from "~counselings/domains/counsels/models/compressed-messages";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { CompressedMessageId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";

@Injectable()
export abstract class CounselsReader {
  abstract findOne(props: { counselId: CounselId }): Promise<Counsels | null>;
  abstract findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]>;
  abstract findOneMessage(props: { counselMessageId: CounselMessageId }): Promise<CounselMessages | null>;
  abstract findManyMessages(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]>;
  abstract findOneCompressedMessage(props: {
    compressedMessageId: CompressedMessageId;
  }): Promise<CompressedMessages | null>;
  abstract findManyCompressedMessages(props: CompressedMessagesCriteriaFindMany): Promise<CompressedMessages[]>;
}
