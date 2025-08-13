import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";

export type CounselTechniquesCriteriaFindMany = {
  name?: string;
  toneId?: ToneId;
  ids?: CounselTechniqueId[];
};
