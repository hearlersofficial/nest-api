import {
  CounselTechniques,
  CounselTechniquesNewProps,
} from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselTechniquesStore {
  abstract create(newProps: CounselTechniquesNewProps): Promise<CounselTechniques>;
  abstract update(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  abstract updateMany(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]>;
}
