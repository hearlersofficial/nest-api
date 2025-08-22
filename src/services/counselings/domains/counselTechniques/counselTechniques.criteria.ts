import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";

export type UniqueKey = { type: "counselTechnique"; id: CounselTechniqueId };

export type FindOneOptions = {
  toneId?: ToneId;
};

export type FindManyOptions = {
  name?: string;
  toneId?: ToneId;
  ids?: CounselTechniqueId[];
};
