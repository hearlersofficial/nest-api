import { TonePromptInfo } from "~counselings/domains/tonePrompts/models/tonePrompt.info";
import { TonePromptsNewProps } from "~counselings/domains/tonePrompts/models/tonePrompts";
import { TonePromptsPersister } from "~counselings/domains/tonePrompts/tonePrompts.persister";
import { TonePromptsReader } from "~counselings/domains/tonePrompts/tonePrompts.reader";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class TonePromptsService {
  constructor(
    private readonly tonePromptsReader: TonePromptsReader,
    private readonly tonePromptsPersister: TonePromptsPersister,
  ) {}

  @Transactional()
  async create(newProps: TonePromptsNewProps): Promise<TonePromptInfo> {
    const tonePrompt = await this.tonePromptsPersister.create(newProps);
    return TonePromptInfo.fromDomain(tonePrompt);
  }

  async getOne(props: { tonePromptId: UniqueEntityId }): Promise<TonePromptInfo> {
    const tonePrompt = await this.tonePromptsReader.findOne(props);
    if (!tonePrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "TonePrompt not found");
    }
    return TonePromptInfo.fromDomain(tonePrompt);
  }
}
