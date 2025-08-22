import { TonePromptInfo } from "~counselings/domains/tone-prompts/models/tone-prompt.info";
import { TonePromptsNewProps } from "~counselings/domains/tone-prompts/models/tone-prompts";
import * as TonePromptsCriteria from "~counselings/domains/tone-prompts/tone-prompts.criteria";
import { TonePromptsReader } from "~counselings/domains/tone-prompts/tone-prompts.reader";
import { TonePromptsStore } from "~counselings/domains/tone-prompts/tone-prompts.store";

import { HttpStatus, Injectable } from "@nestjs/common";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class TonePromptsService {
  constructor(
    private readonly tonePromptsReader: TonePromptsReader,
    private readonly tonePromptsStore: TonePromptsStore,
  ) {}

  @Transactional()
  async create(newProps: TonePromptsNewProps): Promise<TonePromptInfo> {
    const tonePrompt = await this.tonePromptsStore.create(newProps);
    return TonePromptInfo.fromDomain(tonePrompt);
  }

  @Transactional()
  async update(
    tonePromptId: TonePromptId,
    updateProps: Partial<Pick<TonePromptsNewProps, "body">>,
  ): Promise<TonePromptInfo> {
    const tonePrompt = await this.tonePromptsReader.findOne({
      uniqueCriteria: { type: "tonePrompt", id: tonePromptId },
    });
    if (!tonePrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "TonePrompt not found");
    }
    tonePrompt.update(updateProps);
    await this.tonePromptsStore.update(tonePrompt);
    return TonePromptInfo.fromDomain(tonePrompt);
  }

  async getOne(props: {
    uniqueCriteria: TonePromptsCriteria.UniqueKey;
    options?: TonePromptsCriteria.FindOneOptions;
  }): Promise<TonePromptInfo> {
    const tonePrompt = await this.tonePromptsReader.findOne(props);
    if (!tonePrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "TonePrompt not found");
    }
    return TonePromptInfo.fromDomain(tonePrompt);
  }

  async findMany(props: TonePromptsCriteria.FindManyOptions): Promise<TonePromptInfo[]> {
    const tonePrompts = await this.tonePromptsReader.findMany(props);
    return tonePrompts.map((tonePrompt) => TonePromptInfo.fromDomain(tonePrompt));
  }
}
