import { TonePrompts, TonePromptsNewProps } from "~counselings/domains/tone-prompts/models/tone-prompts";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TonePromptsStore {
  abstract create(newProps: TonePromptsNewProps): Promise<TonePrompts>;
  abstract update(tonePrompt: TonePrompts): Promise<TonePrompts>;
  abstract updateMany(tonePrompts: TonePrompts[]): Promise<TonePrompts[]>;
}
