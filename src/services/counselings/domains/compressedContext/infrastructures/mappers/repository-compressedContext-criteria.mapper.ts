import { CompressedContextCriteriaFindMany } from "~counselings/domains/compressedContext/compressedContext.criteria";

import { CompressedContextsEntity } from "~common/system/persistences/entities/councels/CompressedContexts.entity";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryCompressedContextCriteriaMapper {
  static toFindManyOptions(criteria: CompressedContextCriteriaFindMany): FindManyOptions<CompressedContextsEntity> {
    const where: FindOptionsWhere<CompressedContextsEntity> = {};
    where.counselId = criteria.counselId.getString();
    return { where };
  }
}
