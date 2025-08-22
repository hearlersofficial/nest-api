import * as TransitionRulesCriteria from "~counselings/domains/counsel-techniques/counsel-technique-transition-rules.criteria";
import * as CounselTechniquesCriteria from "~counselings/domains/counsel-techniques/counsel-techniques.criteria";
import { CounselTechniquesReader } from "~counselings/domains/counsel-techniques/counsel-techniques.reader";
import { CounselTechniqueTransitionRulesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-technique-transition-rules.repository";
import { CounselTechniquesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-techniques.repository";
import { RepositoryCounselTechniqueTransitionRulesCriteriaMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/repository-counsel-technique-transition-rules-criteria.mapper";
import { RepositoryCounselTechniqueCriteriaMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/repository-counsel-techniques-criteria.mapper";
import { CounselTechniqueTransitionRules } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
import { CounselTechniques } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

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
    switch (props.uniqueCriteria.type) {
      case "counselTechnique":
        return this.counselTechniquesRepository.findByCounselTechniqueId(props.uniqueCriteria.id, typeormOptions);
      case "startTechnique":
        return this.counselTechniquesRepository.findStartTechnique(
          props.uniqueCriteria.toneId,
          props.uniqueCriteria.promptVersionId,
          typeormOptions,
        );
      default:
        return null;
    }
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
    switch (props.uniqueCriteria.type) {
      case "counselTechniqueTransitionRule":
        return this.counselTechniqueTransitionRulesRepository.findById(props.uniqueCriteria.id, typeormOptions);
      case "edge":
        return this.counselTechniqueTransitionRulesRepository.findEdge(
          props.uniqueCriteria.fromCounselTechniqueId,
          props.uniqueCriteria.toCounselTechniqueId,
          props.uniqueCriteria.promptVersionId,
          typeormOptions,
        );
      default:
        return null;
    }
  }

  override async findManyTransitionRules(
    props: TransitionRulesCriteria.FindManyOptions,
  ): Promise<CounselTechniqueTransitionRules[]> {
    const typeormOptions = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(props);
    return this.counselTechniqueTransitionRulesRepository.findMany(typeormOptions);
  }
}
