import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/prompts/CounselTechniques.entity";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselTechniquesRepository {
  abstract findByCounselTechniqueId(counselTechniqueId: UniqueEntityId, options?: FindOneOptions<CounselTechniquesEntity>): Promise<CounselTechniques | null>;
  abstract findByToneId(toneId: UniqueEntityId, options?: FindOneOptions<CounselTechniquesEntity>): Promise<CounselTechniques | null>;
  abstract findMany(options?: FindManyOptions<CounselTechniquesEntity>): Promise<CounselTechniques[]>;
  abstract save(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  abstract save(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]>;
}
