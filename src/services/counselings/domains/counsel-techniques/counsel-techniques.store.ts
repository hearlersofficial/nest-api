import {
  CounselTechniqueTransitionRules,
  CounselTechniqueTransitionRulesNewProps,
} from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
import {
  CounselTechniques,
  CounselTechniquesNewProps,
} from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselTechniquesStore {
  abstract create(newProps: CounselTechniquesNewProps): Promise<CounselTechniques>;
  abstract update(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  abstract updateMany(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]>;

  abstract createTransitionRule(
    newProps: CounselTechniqueTransitionRulesNewProps,
  ): Promise<CounselTechniqueTransitionRules>;
  abstract updateTransitionRule(
    counselTechniqueTransitionRule: CounselTechniqueTransitionRules,
  ): Promise<CounselTechniqueTransitionRules>;
  abstract updateManyTransitionRules(
    counselTechniqueTransitionRules: CounselTechniqueTransitionRules[],
  ): Promise<CounselTechniqueTransitionRules[]>;
}
