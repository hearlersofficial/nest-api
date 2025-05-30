import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/CounselTechniques.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselTechniquesRepository {
  abstract findByCounselTechniqueId(
    counselTechniqueId: UniqueEntityId,
    options?: FindOneOptions<CounselTechniquesEntity>,
  ): Promise<CounselTechniques | null>;
  abstract findMany(options?: FindManyOptions<CounselTechniquesEntity>): Promise<CounselTechniques[]>;
  abstract save(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  abstract save(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]>;
}
