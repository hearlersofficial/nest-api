import * as TransitionRulesCriteria from "~counselings/domains/counselTechniques/counsel-technique-transition-rules.criteria";

import { isDefined } from "~common/shared/utils/validate";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

export class RepositoryCounselTechniqueTransitionRulesCriteriaMapper {
  static toFindOneOptions(
    options?: TransitionRulesCriteria.FindOneOptions,
  ): FindOneOptions<CounselTechniqueTransitionRuleEntity> {
    if (!isDefined(options)) {
      return {};
    }

    const where: FindOptionsWhere<CounselTechniqueTransitionRuleEntity> = {};
    if (isDefined(options.fromCounselTechniqueId)) {
      where.fromCounselTechniqueId = options.fromCounselTechniqueId.getString();
    }
    if (isDefined(options.toCounselTechniqueId)) {
      where.toCounselTechniqueId = options.toCounselTechniqueId.getString();
    }

    return { where };
  }

  static toFindManyOptions(
    criteria: TransitionRulesCriteria.FindManyOptions,
  ): FindManyOptions<CounselTechniqueTransitionRuleEntity> {
    const where: FindOptionsWhere<CounselTechniqueTransitionRuleEntity> = {};

    if (isDefined(criteria.fromCounselTechniqueId)) {
      where.fromCounselTechniqueId = criteria.fromCounselTechniqueId.getString();
    }
    if (isDefined(criteria.toCounselTechniqueId)) {
      where.toCounselTechniqueId = criteria.toCounselTechniqueId.getString();
    }

    return { where };
  }
}
