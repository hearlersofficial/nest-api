import { RepositoryPromptVersionCriteriaMapper } from "~counselings/domains/prompt-versions/infrastructures/mappers/repository-prompt-versions-criteria.mapper";
import { PromptVersionsRepository } from "~counselings/domains/prompt-versions/infrastructures/prompt-versions.repository";
import { PromptVersions } from "~counselings/domains/prompt-versions/models/prompt-versions";
import * as PromptVersionsCriteria from "~counselings/domains/prompt-versions/prompt-versions.criteria";
import { PromptVersionsReader } from "~counselings/domains/prompt-versions/prompt-versions.reader";

import { Injectable } from "@nestjs/common";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

@Injectable()
export class RepositoryPromptVersionsReader extends PromptVersionsReader {
  constructor(private readonly promptVersionsRepository: PromptVersionsRepository) {
    super();
  }

  override async findOne(props: {
    promptVersionId: PromptVersionId;
    withDeleted?: boolean;
  }): Promise<PromptVersions | null> {
    return this.promptVersionsRepository.findByPromptVersionId(props.promptVersionId, {
      withDeleted: props.withDeleted,
    });
  }

  override async findMany(props: PromptVersionsCriteria.FindManyOptions): Promise<PromptVersions[]> {
    const typeormOptions = RepositoryPromptVersionCriteriaMapper.toFindManyOptions(props);
    return this.promptVersionsRepository.findMany(typeormOptions);
  }
}
