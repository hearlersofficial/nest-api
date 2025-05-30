import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counselMessages/counselMessages.criteria";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export abstract class CounselMessagesReader {
  abstract findOne(props: { counselMessageId: UniqueEntityId }): Promise<CounselMessages | null>;
  abstract findMany(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]>;
}
