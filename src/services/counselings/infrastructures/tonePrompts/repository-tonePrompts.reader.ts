import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";
import { TonePromptsCriteriaFindMany } from "~counselings/domains/tonePrompts/tonePrompts.criteria";
import { TonePromptsReader } from "~counselings/domains/tonePrompts/tonePrompts.reader";
import { RepositoryTonePromptCriteriaMapper } from "~counselings/infrastructures/tonePrompts/mappers/repository-tonePrompts-criteria.mapper";
import { TonePromptsRepository } from "~counselings/infrastructures/tonePrompts/tonePrompts.repository";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryTonePromptsReader extends TonePromptsReader {
  constructor(private readonly tonePromptsRepository: TonePromptsRepository) {
    super();
  }

  override async findOne(props: { tonePromptId: UniqueEntityId }): Promise<TonePrompts | null> {
    return this.tonePromptsRepository.findByTonePromptId(props.tonePromptId);
  }

  override async findMany(props: TonePromptsCriteriaFindMany): Promise<TonePrompts[]> {
    const typeormOptions = RepositoryTonePromptCriteriaMapper.toFindManyOptions(props);
    return this.tonePromptsRepository.findMany(typeormOptions);
  }
}
