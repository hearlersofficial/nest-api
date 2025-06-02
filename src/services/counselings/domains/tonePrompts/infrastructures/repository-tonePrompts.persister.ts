import { TonePromptsRepository } from "~counselings/domains/tonePrompts/infrastructures/tonePrompts.repository";
import { TonePrompts, TonePromptsNewProps } from "~counselings/domains/tonePrompts/models/tonePrompts";
import { TonePromptsPersister } from "~counselings/domains/tonePrompts/tonePrompts.persister";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryTonePromptsPersister extends TonePromptsPersister {
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
