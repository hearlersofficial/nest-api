import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsCriteriaFindMany } from "~counselings/domains/counselors/counselors.criteria";
import { Counselors } from "~counselings/domains/counselors/models/counselors";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselorsReader {
  abstract findOne(props: { counselorId: UniqueEntityId }): Promise<Counselors | null>;
  abstract findMany(props: CounselorsCriteriaFindMany): Promise<Counselors[]>;
}
