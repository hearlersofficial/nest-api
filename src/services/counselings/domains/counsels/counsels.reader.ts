import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counsels/counsel-messages.criteria";
import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export abstract class CounselsReader {
  abstract findOne(props: { counselId: UniqueEntityId }): Promise<Counsels | null>;
  abstract findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]>;
  abstract findOneMessage(props: { counselMessageId: UniqueEntityId }): Promise<CounselMessages | null>;
  abstract findManyMessages(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]>;
}
