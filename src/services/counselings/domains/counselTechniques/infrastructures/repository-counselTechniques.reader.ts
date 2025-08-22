import * as TransitionRulesCriteria from "~counselings/domains/counselTechniques/counsel-technique-transition-rules.criteria";
import * as CounselTechniquesCriteria from "~counselings/domains/counselTechniques/counselTechniques.criteria";
import { CounselTechniquesReader } from "~counselings/domains/counselTechniques/counselTechniques.reader";
import { CounselTechniqueTransitionRulesRepository } from "~counselings/domains/counselTechniques/infrastructures/counsel-technique-transition-rules.repository";
import { CounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/counselTechniques.repository";
import { RepositoryCounselTechniqueTransitionRulesCriteriaMapper } from "~counselings/domains/counselTechniques/infrastructures/mappers/repository-counsel-technique-transition-rules-criteria.mapper";
import { RepositoryCounselTechniqueCriteriaMapper } from "~counselings/domains/counselTechniques/infrastructures/mappers/repository-counselTechniques-criteria.mapper";
import { CounselTechniqueTransitionRules } from "~counselings/domains/counselTechniques/models/counsel-technique-transition-rules";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryCounselTechniquesReader extends CounselTechniquesReader {
  constructor(
    private readonly counselTechniquesRepository: CounselTechniquesRepository,
    private readonly counselTechniqueTransitionRulesRepository: CounselTechniqueTransitionRulesRepository,
  ) {
    super();
  }

  override async findOne(props: {
    uniqueCriteria: CounselTechniquesCriteria.UniqueKey;
    options?: CounselTechniquesCriteria.FindOneOptions;
  }): Promise<CounselTechniques | null> {
    const typeormOptions = RepositoryCounselTechniqueCriteriaMapper.toFindOneOptions(props.options);
    return this.counselTechniquesRepository.findByCounselTechniqueId(props.uniqueCriteria.id, typeormOptions);
  }

  override async findMany(props: CounselTechniquesCriteria.FindManyOptions): Promise<CounselTechniques[]> {
    const typeormOptions = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(props);
    return this.counselTechniquesRepository.findMany(typeormOptions);
  }

  override async findOneTransitionRule(props: {
    uniqueCriteria: TransitionRulesCriteria.UniqueKey;
    options?: TransitionRulesCriteria.FindOneOptions;
  }): Promise<CounselTechniqueTransitionRules | null> {
    const typeormOptions = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(props.options);
    return this.counselTechniqueTransitionRulesRepository.findById(props.uniqueCriteria.id, typeormOptions);
  }

  override async findManyTransitionRules(
    props: TransitionRulesCriteria.FindManyOptions,
  ): Promise<CounselTechniqueTransitionRules[]> {
    const typeormOptions = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(props);
    return this.counselTechniqueTransitionRulesRepository.findMany(typeormOptions);
  }
}
