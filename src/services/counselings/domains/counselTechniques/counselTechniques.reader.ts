import { CounselTechniquesCriteriaFindMany } from "~counselings/domains/counselTechniques/counselTechniques.criteria";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";

@Injectable()
export abstract class CounselTechniquesReader {
  abstract findOne(props: { counselTechniqueId: CounselTechniqueId }): Promise<CounselTechniques | null>;
  abstract findMany(props: CounselTechniquesCriteriaFindMany): Promise<CounselTechniques[]>;
}
