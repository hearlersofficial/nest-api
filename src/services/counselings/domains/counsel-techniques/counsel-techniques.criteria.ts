import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";

export type UniqueKey = { type: "counselTechnique"; id: CounselTechniqueId };

export type FindOneOptions = {
  toneId?: ToneId;
};

export type FindManyOptions = {
  name?: string;
  promptVersionId?: PromptVersionId;
  toneId?: ToneId;
  ids?: CounselTechniqueId[];
};
