import * as TransitionRulesCriteria from "~counselings/domains/counsel-techniques/counsel-technique-transition-rules.criteria";
import * as CounselTechniquesCriteria from "~counselings/domains/counsel-techniques/counsel-techniques.criteria";
import { CounselTechniqueTransitionRules } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
import { CounselTechniques } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselTechniquesReader {
  abstract findOne(props: {
    uniqueCriteria: CounselTechniquesCriteria.UniqueKey;
    options?: CounselTechniquesCriteria.FindOneOptions;
  }): Promise<CounselTechniques | null>;
  abstract findMany(props: CounselTechniquesCriteria.FindManyOptions): Promise<CounselTechniques[]>;

  abstract findOneTransitionRule(props: {
    uniqueCriteria: TransitionRulesCriteria.UniqueKey;
    options?: TransitionRulesCriteria.FindOneOptions;
  }): Promise<CounselTechniqueTransitionRules | null>;
  abstract findManyTransitionRules(
    props: TransitionRulesCriteria.FindManyOptions,
  ): Promise<CounselTechniqueTransitionRules[]>;
}
