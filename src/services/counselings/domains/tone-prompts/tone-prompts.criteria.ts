import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";

export type UniqueKey =
  | {
      type: "tonePrompt";
      id: TonePromptId;
    }
  | {
      type: "versionAndTone";
      promptVersionId: PromptVersionId;
      toneId: ToneId;
    };

export type FindOneOptions = {
  promptVersionId?: PromptVersionId;
};

export type FindManyOptions = {
  toneId?: ToneId;
  promptVersionId?: PromptVersionId;
};
