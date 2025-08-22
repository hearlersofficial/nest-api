import { CounselTechniquesStore } from "~counselings/domains/counsel-techniques/counsel-techniques.store";
import { CounselTechniqueTransitionRulesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-technique-transition-rules.repository";
import { CounselTechniquesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counselTechniques.repository";
import {
  CounselTechniqueTransitionRules,
  CounselTechniqueTransitionRulesNewProps,
} from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
import {
  CounselTechniques,
  CounselTechniquesNewProps,
} from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryCounselTechniquesStore extends CounselTechniquesStore {
  constructor(
    private readonly counselTechniquesRepository: CounselTechniquesRepository,
    private readonly counselTechniqueTransitionRulesRepository: CounselTechniqueTransitionRulesRepository,
  ) {
    super();
  }

  override async create(newProps: CounselTechniquesNewProps): Promise<CounselTechniques> {
    const counselTechniqueResult = CounselTechniques.createNew(newProps);
    if (counselTechniqueResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselTechniqueResult.error as string);
    }
    return this.counselTechniquesRepository.save(counselTechniqueResult.value);
  }

  override async update(counselTechnique: CounselTechniques): Promise<CounselTechniques> {
    return this.counselTechniquesRepository.save(counselTechnique);
  }

  override async updateMany(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]> {
    return this.counselTechniquesRepository.save(counselTechniques);
  }

  override async createTransitionRule(
    newProps: CounselTechniqueTransitionRulesNewProps,
  ): Promise<CounselTechniqueTransitionRules> {
    const transitionRuleResult = CounselTechniqueTransitionRules.createNew(newProps);
    if (transitionRuleResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, transitionRuleResult.error as string);
    }
    return this.counselTechniqueTransitionRulesRepository.save(transitionRuleResult.value);
  }

  override async updateTransitionRule(
    counselTechniqueTransitionRule: CounselTechniqueTransitionRules,
  ): Promise<CounselTechniqueTransitionRules> {
    return this.counselTechniqueTransitionRulesRepository.save(counselTechniqueTransitionRule);
  }

  override async updateManyTransitionRules(
    counselTechniqueTransitionRules: CounselTechniqueTransitionRules[],
  ): Promise<CounselTechniqueTransitionRules[]> {
    return this.counselTechniqueTransitionRulesRepository.save(counselTechniqueTransitionRules);
  }

  private async saveTransitionRules(
    counselTechniqueTransitionRules: CounselTechniqueTransitionRules[],
  ): Promise<CounselTechniqueTransitionRules[]> {
    return this.counselTechniqueTransitionRulesRepository.save(counselTechniqueTransitionRules);
  }
}
