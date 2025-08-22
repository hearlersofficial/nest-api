import { CounselTechniqueTransitionRules } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";

import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

export abstract class CounselTechniqueTransitionRulesRepository {
  abstract findById(
    id: CounselTechniqueTransitionRuleId,
    options?: FindOneOptions<CounselTechniqueTransitionRuleEntity>,
  ): Promise<CounselTechniqueTransitionRules | null>;
  abstract findEdge(
    fromCounselTechniqueId: CounselTechniqueId,
    toCounselTechniqueId: CounselTechniqueId,
    promptVersionId: PromptVersionId,
    options?: FindOneOptions<CounselTechniqueTransitionRuleEntity>,
  ): Promise<CounselTechniqueTransitionRules | null>;
  abstract findMany(
    options?: FindManyOptions<CounselTechniqueTransitionRuleEntity>,
  ): Promise<CounselTechniqueTransitionRules[]>;
  abstract save(
    counselTechniqueTransitionRule: CounselTechniqueTransitionRules,
  ): Promise<CounselTechniqueTransitionRules>;
  abstract save(
    counselTechniqueTransitionRules: CounselTechniqueTransitionRules[],
  ): Promise<CounselTechniqueTransitionRules[]>;
}
