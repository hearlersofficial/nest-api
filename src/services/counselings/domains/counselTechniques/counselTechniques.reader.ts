import { CounselTechniquesCriteriaFindMany } from "~counselings/domains/counselTechniques/counselTechniques.criteria";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export abstract class CounselTechniquesReader {
  abstract findOne(props: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniques | null>;
  abstract findMany(props: CounselTechniquesCriteriaFindMany): Promise<CounselTechniques[]>;
}
