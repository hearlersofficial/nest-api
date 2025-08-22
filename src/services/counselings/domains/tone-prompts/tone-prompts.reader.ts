import { TonePrompts } from "~counselings/domains/tone-prompts/models/tone-prompts";
import * as TonePromptsCriteria from "~counselings/domains/tone-prompts/tone-prompts.criteria";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TonePromptsReader {
  abstract findOne(props: {
    uniqueCriteria: TonePromptsCriteria.UniqueKey;
    options?: TonePromptsCriteria.FindOneOptions;
  }): Promise<TonePrompts | null>;
  abstract findMany(props: TonePromptsCriteria.FindManyOptions): Promise<TonePrompts[]>;
}
