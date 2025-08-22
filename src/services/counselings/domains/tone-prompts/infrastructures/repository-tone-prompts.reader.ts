import { RepositoryTonePromptCriteriaMapper } from "~counselings/domains/tone-prompts/infrastructures/mappers/repository-tonePrompts-criteria.mapper";
import { TonePromptsRepository } from "~counselings/domains/tone-prompts/infrastructures/tone-prompts.repository";
import { TonePrompts } from "~counselings/domains/tone-prompts/models/tone-prompts";
import * as TonePromptsCriteria from "~counselings/domains/tone-prompts/tone-prompts.criteria";
import { TonePromptsReader } from "~counselings/domains/tone-prompts/tone-prompts.reader";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryTonePromptsReader extends TonePromptsReader {
  constructor(private readonly tonePromptsRepository: TonePromptsRepository) {
    super();
  }

  override async findOne(props: {
    uniqueCriteria: TonePromptsCriteria.UniqueKey;
    options?: TonePromptsCriteria.FindOneOptions;
  }): Promise<TonePrompts | null> {
    const { uniqueCriteria, options } = props;
    const typeormOptions = options ? RepositoryTonePromptCriteriaMapper.toFindOneOptions(options) : undefined;
    if (uniqueCriteria.type === "tonePrompt") {
      return this.tonePromptsRepository.findByTonePromptId(uniqueCriteria.id, typeormOptions);
    }
    if (uniqueCriteria.type === "versionAndTone") {
      return this.tonePromptsRepository.findByVersionAndTone(
        uniqueCriteria.promptVersionId,
        uniqueCriteria.toneId,
        typeormOptions,
      );
    }
    return null;
  }

  override async findMany(props: TonePromptsCriteria.FindManyOptions): Promise<TonePrompts[]> {
    const typeormOptions = RepositoryTonePromptCriteriaMapper.toFindManyOptions(props);
    return this.tonePromptsRepository.findMany(typeormOptions);
  }
}
