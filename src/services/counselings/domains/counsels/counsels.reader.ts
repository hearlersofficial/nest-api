import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselsReader {
  abstract findOne(props: { counselId: UniqueEntityId }): Promise<Counsels | null>;
  abstract findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]>;
}
