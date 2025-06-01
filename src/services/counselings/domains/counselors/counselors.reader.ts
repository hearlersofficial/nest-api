import { CounselorsCriteriaFindMany } from "~counselings/domains/counselors/counselors.criteria";
import { Counselors } from "~counselings/domains/counselors/models/counselors";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export abstract class CounselorsReader {
  abstract findOne(props: { counselorId: UniqueEntityId }): Promise<Counselors | null>;
  abstract getOne(props: { counselorId: UniqueEntityId }): Promise<Counselors>;
  abstract findMany(props: CounselorsCriteriaFindMany): Promise<Counselors[]>;
}
