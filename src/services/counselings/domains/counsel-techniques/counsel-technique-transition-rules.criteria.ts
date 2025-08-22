import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";

export type UniqueKey = { type: "counselTechniqueTransitionRule"; id: CounselTechniqueTransitionRuleId };

export type FindOneOptions = {
  fromCounselTechniqueId?: CounselTechniqueId;
  toCounselTechniqueId?: CounselTechniqueId;
};

export type FindManyOptions = {
  fromCounselTechniqueId?: CounselTechniqueId;
  toCounselTechniqueId?: CounselTechniqueId;
};
