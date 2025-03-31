import { TonePrompts, TonePromptsNewProps } from "~counselings/domains/tonePrompts/models/tonePrompts";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TonePromptsPersister {
  abstract create(newProps: TonePromptsNewProps): Promise<TonePrompts>;
  abstract update(tonePrompt: TonePrompts): Promise<TonePrompts>;
  abstract updateMany(tonePrompts: TonePrompts[]): Promise<TonePrompts[]>;
}
