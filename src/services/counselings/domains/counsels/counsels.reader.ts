import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";

@Injectable()
export abstract class CounselsReader {
  abstract findOne(props: { counselId: UniqueEntityId }): Promise<Counsels | null>;
  abstract findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]>;
}
