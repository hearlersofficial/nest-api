import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counselMessages/counselMessages.criteria";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselMessagesReader {
  abstract findOne(props: { counselMessageId: UniqueEntityId }): Promise<CounselMessages | null>;
  abstract findMany(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]>;
}
