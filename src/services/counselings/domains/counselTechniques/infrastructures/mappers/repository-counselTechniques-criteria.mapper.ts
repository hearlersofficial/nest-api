import * as CounselTechniquesCriteria from "~counselings/domains/counselTechniques/counselTechniques.criteria";

import { isDefined } from "~common/shared/utils/validate";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In } from "typeorm";

export class RepositoryCounselTechniqueCriteriaMapper {
  static toFindOneOptions(options?: CounselTechniquesCriteria.FindOneOptions): FindOneOptions<CounselTechniquesEntity> {
    if (!isDefined(options)) {
      return {};
    }

    const where: FindOptionsWhere<CounselTechniquesEntity> = {};
    if (isDefined(options.toneId)) {
      where.toneId = options.toneId.getString();
    }

    return { where };
  }

  static toFindManyOptions(
    criteria: CounselTechniquesCriteria.FindManyOptions,
  ): FindManyOptions<CounselTechniquesEntity> {
    const where: FindOptionsWhere<CounselTechniquesEntity> = {};

    if (isDefined(criteria.name)) {
      where.name = criteria.name;
    }
    if (isDefined(criteria.toneId)) {
      where.toneId = criteria.toneId.getString();
    }
    if (isDefined(criteria.ids)) {
      where.id = In(criteria.ids.map((id) => id.getString()));
    }

    return { where };
  }
}
