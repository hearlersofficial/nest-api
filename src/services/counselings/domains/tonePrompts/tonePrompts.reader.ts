import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";
import { TonePromptsCriteriaFindMany } from "~counselings/domains/tonePrompts/tonePrompts.criteria";

import { Injectable } from "@nestjs/common";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";

@Injectable()
export abstract class TonePromptsReader {
  abstract findOne(props: { tonePromptId: TonePromptId }): Promise<TonePrompts | null>;
  abstract findMany(props: TonePromptsCriteriaFindMany): Promise<TonePrompts[]>;
}
