import { RepositoryTonePromptCriteriaMapper } from "~counselings/domains/tone-prompts/infrastructures/mappers/repository-tonePrompts-criteria.mapper";
import { TonePromptsRepository } from "~counselings/domains/tone-prompts/infrastructures/tone-prompts.repository";
import { TonePrompts } from "~counselings/domains/tone-prompts/models/tone-prompts";
import { TonePromptsCriteriaFindMany } from "~counselings/domains/tone-prompts/tone-prompts.criteria";
import { TonePromptsReader } from "~counselings/domains/tone-prompts/tone-prompts.reader";

import { Injectable } from "@nestjs/common";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";

@Injectable()
export class RepositoryTonePromptsReader extends TonePromptsReader {
  constructor(private readonly tonePromptsRepository: TonePromptsRepository) {
    super();
  }

  override async findOne(props: { tonePromptId: TonePromptId }): Promise<TonePrompts | null> {
    return this.tonePromptsRepository.findByTonePromptId(props.tonePromptId);
  }

  override async findMany(props: TonePromptsCriteriaFindMany): Promise<TonePrompts[]> {
    const typeormOptions = RepositoryTonePromptCriteriaMapper.toFindManyOptions(props);
    return this.tonePromptsRepository.findMany(typeormOptions);
  }
}
