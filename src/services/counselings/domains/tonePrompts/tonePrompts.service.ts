import { TonePrompts, TonePromptsNewProps } from "~counselings/domains/tonePrompts/models/tonePrompts";
import { TonePromptsCriteriaFindMany } from "~counselings/domains/tonePrompts/tonePrompts.criteria";
import { TonePromptsPersister } from "~counselings/domains/tonePrompts/tonePrompts.persister";
import { TonePromptsReader } from "~counselings/domains/tonePrompts/tonePrompts.reader";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class TonePromptsService {
  constructor(
    private readonly tonePromptsReader: TonePromptsReader,
    private readonly tonePromptsPersister: TonePromptsPersister,
  ) {}

  async create(newProps: TonePromptsNewProps): Promise<TonePrompts> {
    return this.tonePromptsPersister.create(newProps);
  }

  async update(tonePrompt: TonePrompts): Promise<TonePrompts> {
    return this.tonePromptsPersister.update(tonePrompt);
  }

  async findOne(props: { tonePromptId: UniqueEntityId }): Promise<TonePrompts | null> {
    return this.tonePromptsReader.findOne(props);
  }

  async getOne(props: { tonePromptId: UniqueEntityId }): Promise<TonePrompts> {
    const tonePrompt = await this.findOne(props);
    if (!tonePrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "TonePrompt not found");
    }
    return tonePrompt;
  }

  async findMany(props: TonePromptsCriteriaFindMany): Promise<TonePrompts[]> {
    return this.tonePromptsReader.findMany(props);
  }
}
