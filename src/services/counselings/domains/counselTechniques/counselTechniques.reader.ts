import * as TransitionRulesCriteria from "~counselings/domains/counselTechniques/counsel-technique-transition-rules.criteria";
import * as CounselTechniquesCriteria from "~counselings/domains/counselTechniques/counselTechniques.criteria";
import { CounselTechniqueTransitionRules } from "~counselings/domains/counselTechniques/models/counsel-technique-transition-rules";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

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
