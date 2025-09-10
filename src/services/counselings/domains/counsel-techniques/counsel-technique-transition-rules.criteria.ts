import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

export type UniqueKey = { type: "counselTechniqueTransitionRule"; id: CounselTechniqueTransitionRuleId };

export type FindOneOptions = {
  fromCounselTechniqueId?: CounselTechniqueId;
  toCounselTechniqueId?: CounselTechniqueId;
  promptVersionId?: PromptVersionId;
};

export type FindManyOptions = {
  fromCounselTechniqueId?: CounselTechniqueId;
  toCounselTechniqueId?: CounselTechniqueId;
  promptVersionId?: PromptVersionId;
};
