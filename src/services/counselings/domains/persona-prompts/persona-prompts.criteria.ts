import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

export type UniqueKey =
  | {
      type: "personaPrompt";
      id: PersonaPromptId;
    }
  | {
      type: "versionAndCounselor";
      promptVersionId: PromptVersionId;
      counselorId: CounselorId;
    };

export type FindOneOptions = {
  promptVersionId?: PromptVersionId;
};

export type FindManyOptions = {
  counselorId?: CounselorId;
  promptVersionId?: PromptVersionId;
};
