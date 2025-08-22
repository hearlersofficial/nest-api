import { TonePrompts } from "~counselings/domains/tone-prompts/models/tone-prompts";
import { TonePromptsCriteriaFindMany } from "~counselings/domains/tone-prompts/tone-prompts.criteria";

import { Injectable } from "@nestjs/common";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";

@Injectable()
export abstract class TonePromptsReader {
  abstract findOne(props: { tonePromptId: TonePromptId }): Promise<TonePrompts | null>;
  abstract findMany(props: TonePromptsCriteriaFindMany): Promise<TonePrompts[]>;
}
