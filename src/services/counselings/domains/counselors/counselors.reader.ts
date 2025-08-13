import { CounselorsCriteriaFindMany } from "~counselings/domains/counselors/counselors.criteria";
import { Counselors } from "~counselings/domains/counselors/models/counselors";

import { Injectable } from "@nestjs/common";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";

@Injectable()
export abstract class CounselorsReader {
  abstract findOne(props: { counselorId: CounselorId }): Promise<Counselors | null>;
  abstract getOne(props: { counselorId: CounselorId }): Promise<Counselors>;
  abstract findMany(props: CounselorsCriteriaFindMany): Promise<Counselors[]>;
}
