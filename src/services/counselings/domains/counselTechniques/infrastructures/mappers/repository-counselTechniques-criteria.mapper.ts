import { CounselTechniquesCriteriaFindMany } from "~counselings/domains/counselTechniques/counselTechniques.criteria";

import { isDefined } from "~common/shared/utils/validate";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/CounselTechniques.entity";
import { FindManyOptions, FindOptionsWhere, In } from "typeorm";

export class RepositoryCounselTechniqueCriteriaMapper {
  static toFindManyOptions(criteria: CounselTechniquesCriteriaFindMany): FindManyOptions<CounselTechniquesEntity> {
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
