import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counsels/counsel-messages.criteria";
import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";

@Injectable()
export abstract class CounselsReader {
  abstract findOne(props: { counselId: CounselId }): Promise<Counsels | null>;
  abstract findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]>;
  abstract findOneMessage(props: { counselMessageId: CounselMessageId }): Promise<CounselMessages | null>;
  abstract findManyMessages(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]>;
}
