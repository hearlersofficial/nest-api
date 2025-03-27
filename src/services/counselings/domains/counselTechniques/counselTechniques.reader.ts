import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesCriteriaFindMany } from "~counselings/domains/counselTechniques/counselTechniques.criteria";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselTechniquesReader {
  abstract findOne(props: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniques | null>;
  abstract findFirst(props: { toneId: UniqueEntityId }): Promise<CounselTechniques | null>;
  abstract findMany(props: CounselTechniquesCriteriaFindMany): Promise<CounselTechniques[]>;
}
