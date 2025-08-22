import { TonePromptsRepository } from "~counselings/domains/tone-prompts/infrastructures/tone-prompts.repository";
import { TonePrompts, TonePromptsNewProps } from "~counselings/domains/tone-prompts/models/tone-prompts";
import { TonePromptsStore } from "~counselings/domains/tone-prompts/tone-prompts.store";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryTonePromptsStore extends TonePromptsStore {
  constructor(private readonly tonePromptsRepository: TonePromptsRepository) {
    super();
  }

  override async create(newProps: TonePromptsNewProps): Promise<TonePrompts> {
    const tonePromptResult = TonePrompts.createNew(newProps);
    if (tonePromptResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, tonePromptResult.error as string);
    }
    return this.tonePromptsRepository.save(tonePromptResult.value);
  }

  override async update(tonePrompt: TonePrompts): Promise<TonePrompts> {
    return this.tonePromptsRepository.save(tonePrompt);
  }

  override async updateMany(tonePrompts: TonePrompts[]): Promise<TonePrompts[]> {
    return this.tonePromptsRepository.save(tonePrompts);
  }
}
