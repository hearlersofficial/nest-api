import { Counsels, CounselsNewProps } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselsPersister {
  abstract create(newProps: CounselsNewProps): Promise<Counsels>;
  abstract update(counsel: Counsels): Promise<Counsels>;
  abstract updateMany(counsels: Counsels[]): Promise<Counsels[]>;
}
