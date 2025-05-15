import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { Counselors, CounselorsNewProps } from "~counselings/domains/counselors/models/counselors";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselorsStore {
  abstract create(newProps: CounselorsNewProps): Promise<Counselors>;
  abstract update(counselor: Counselors): Promise<Counselors>;
  abstract updateMany(counselors: Counselors[]): Promise<Counselors[]>;
  abstract storeBubble(counselor: Counselors, bubble: Bubbles): Promise<Bubbles>;
}
