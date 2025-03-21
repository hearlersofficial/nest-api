import { Counselors, CounselorsNewProps } from "~counselings/domains/counselors/models/counselors";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselorsPersister {
  abstract create(newProps: CounselorsNewProps): Promise<Counselors>;
  abstract update(counselor: Counselors): Promise<Counselors>;
  abstract updateMany(counselors: Counselors[]): Promise<Counselors[]>;
}
