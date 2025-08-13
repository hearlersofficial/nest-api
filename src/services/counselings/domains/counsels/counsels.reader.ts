import {
  CompressedContextCriteriaFindMany,
  CounselMessagesCriteriaFindMany,
  CounselsCriteriaFindMany,
} from "~counselings/domains/counsels/counsels.criteria";
import { CompressedContexts } from "~counselings/domains/counsels/models/compressed-context";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { CompressedContextId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";

@Injectable()
export abstract class CounselsReader {
  abstract findOne(props: { counselId: CounselId }): Promise<Counsels | null>;
  abstract findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]>;
  abstract findOneMessage(props: { counselMessageId: CounselMessageId }): Promise<CounselMessages | null>;
  abstract findManyMessages(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]>;
  abstract findOneCompressedContext(props: {
    compressedContextId: CompressedContextId;
  }): Promise<CompressedContexts | null>;
  abstract findManyCompressedContexts(props: CompressedContextCriteriaFindMany): Promise<CompressedContexts[]>;
}
