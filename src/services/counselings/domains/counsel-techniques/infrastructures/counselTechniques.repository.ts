import { CounselTechniques } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { Injectable } from "@nestjs/common";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselTechniquesRepository {
  abstract findByCounselTechniqueId(
    counselTechniqueId: CounselTechniqueId,
    options?: FindOneOptions<CounselTechniquesEntity>,
  ): Promise<CounselTechniques | null>;
  abstract findMany(options?: FindManyOptions<CounselTechniquesEntity>): Promise<CounselTechniques[]>;
  abstract save(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  abstract save(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]>;
}
